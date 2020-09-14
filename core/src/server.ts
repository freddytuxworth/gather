import {
    AuthCredentialPresentation,
    GroupPublicParams,
    ProfileKeyCommitment,
    ProfileKeyCredentialPresentation,
    ServerPublicParams,
    ServerSecretParams,
    ServerZkAuthOperations,
    ServerZkProfileOperations,
    UuidCiphertext
} from "zkgroup";

import {areEqual, construct, deconstruct, maybeConstruct, nowRedemptionTime, typedArraysEqual} from "./util";

import ProfileKeyCredentialRequest from "zkgroup/dist/zkgroup/profiles/ProfileKeyCredentialRequest";
import {
    GatherServerApi,
    GatherStorage
} from "./types";
import {
    GAddEventMemberRequest,
    GAuthCredentialRequest,
    GAuthCredentialResponse,
    GCreateEventRequest,
    GEventMemberRecord,
    GEventMemberRole,
    GEventRecord,
    GFetchEventRequest,
    GProfileKeyCredentialRequest,
    GProfileKeyCredentialResponse,
    GServerInfo,
    GSetEventMemberStateRequest,
    GUserRecord
} from "./proto/gather_pb";
import {IGatherServiceServer} from "./proto/gather_grpc_pb";
import {sendUnaryData, ServerUnaryCall} from "@grpc/grpc-js";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";

export default class GatherServer implements GatherServerApi {
    private readonly storage: GatherStorage;
    private readonly secretParams: ServerSecretParams;
    private readonly publicParams: ServerPublicParams;
    private readonly zkAuthOperations: ServerZkAuthOperations;
    private readonly zkProfileOperations: ServerZkProfileOperations;
    private readonly serverInfo: GServerInfo;

    constructor(storage: GatherStorage) {
        this.storage = storage;
        this.secretParams = storage.getSecretParams();
        this.publicParams = this.secretParams.getPublicParams();
        this.zkAuthOperations = new ServerZkAuthOperations(this.secretParams);
        this.zkProfileOperations = new ServerZkProfileOperations(this.secretParams);
        this.serverInfo = new GServerInfo();
        this.serverInfo.setPublicparams(deconstruct(this.publicParams));
    }

    async createUser(request: GUserRecord): Promise<Empty> {
        const userExists = await this.storage.findUserByUuid(request.getUuid()!).then(() => true).catch(() => false);
        if (userExists)
            throw new Error("UUID already exists");
        await this.storage.addUser(request);
        return new Empty();
    }

    async getServerInfo(): Promise<GServerInfo> {
        return this.serverInfo;
    }

    async getAuthCredential(request: GAuthCredentialRequest) {
        const user = await this.storage.findUserByUuid(request.getUuid()!);
        if (user === undefined)
            throw new Error("User not found");
        if (!typedArraysEqual(user.getPasswordhash_asU8()!, request.getPasswordhash_asU8()!))
            throw new Error("Authentication failed.");

        const response = new GAuthCredentialResponse();
        response.setAuthcredentialresponse(deconstruct(
            this.zkAuthOperations.issueAuthCredential(request.getUuid()!, nowRedemptionTime())));
        return response;
    }

    async getProfileKeyCredential(request: GProfileKeyCredentialRequest): Promise<GProfileKeyCredentialResponse> {
        const user = await this.storage.findUserByUuid(request.getUuid()!);

        if (!typedArraysEqual(user.getProfile().getProfilekeyversion_asU8(), request.getProfilekeyversion_asU8()))
            throw new Error("User profile key not correct");

        const pKCR = construct(request.getProfilekeycredentialrequest_asU8(), ProfileKeyCredentialRequest)
        const pKC = construct(user.getProfile().getProfilekeycommitment_asU8(), ProfileKeyCommitment);

        //TODO: does this verify the PoK in the ProfileKeyCredentialRequest?
        const profileKeyCredentialResponse = this.zkProfileOperations.issueProfileKeyCredential(pKCR,
            request.getUuid()!, pKC);

        const response = new GProfileKeyCredentialResponse();
        response.setProfilekeycredentialresponse(deconstruct(profileKeyCredentialResponse));
        return response;
    }

    async createEvent(request: GCreateEventRequest): Promise<Empty> {
        const groupPublicParams = construct(request.getGrouppublicparams_asU8(), GroupPublicParams);
        const creatorAuthCredentialPresentation = construct(request.getAuthcredentialpresentation_asU8(),
            AuthCredentialPresentation);

        this.zkAuthOperations.verifyAuthCredentialPresentation(groupPublicParams, creatorAuthCredentialPresentation);
        const profileKeyCredentialPresentations = request.getInitialmembersList().map(initialMember =>
                construct(initialMember.getProfilekeycredentialpresentation_asU8(), ProfileKeyCredentialPresentation));

        profileKeyCredentialPresentations.forEach(pKCP =>
            this.zkProfileOperations.verifyProfileKeyCredentialPresentation(groupPublicParams, pKCP));

        if (!profileKeyCredentialPresentations.some(
            pKCP => areEqual(pKCP.getUuidCiphertext(), creatorAuthCredentialPresentation.getUuidCiphertext())))
            throw new Error('Creator UUID ciphertext is not present in initial members list.');

        const newEvent = new GEventRecord();
        newEvent.setGroupidentifier(deconstruct(groupPublicParams.getGroupIdentifier()));
        newEvent.setGrouppublicparams(request.getGrouppublicparams_asU8());
        newEvent.setContent(request.getContent_asU8());
        newEvent.setMembersList(request.getInitialmembersList());
        await this.storage.addEvent(newEvent);

        return new Empty();
    }

    private async authAsEventMember(groupIdentifier: Uint8Array,
                                    authCredentialPresentation: Uint8Array) {
        const event = await this.storage.findEventByIdentifier(groupIdentifier);
        if (event === undefined)
            throw new Error('No such event');

        const member = GatherServer.findEventMemberForAuthCredentialPresentation(event, authCredentialPresentation);
        if (member === undefined)
            throw new Error("User is not in group.");

        return {event, member};
    }

    async fetchEvent(request: GFetchEventRequest) {
        const {event} = await this.authAsEventMember(request.getGroupidentifier_asU8(), request.getAuthcredentialpresentation_asU8());
        if (event === undefined)
            throw new Error('Group could not be fetched.');
        return event;
    }

    private static canAddMembers(event: GEventRecord, member: GEventMemberRecord) {
        // TODO
        return member.getRole() == GEventMemberRole.CREATOR;
    }

    private static findEventMemberForUUIDCiphertext(event: GEventRecord, uuidCiphertext: UuidCiphertext): GEventMemberRecord | undefined {
        return event.getMembersList().find(
            member => areEqual(construct(member.getProfilekeycredentialpresentation_asU8(), ProfileKeyCredentialPresentation)
                .getUuidCiphertext(), uuidCiphertext))
    }

    private static findEventMemberForAuthCredentialPresentation(event: GEventRecord,
                                                                authCredentialPresentation: Uint8Array): GEventMemberRecord | undefined {
        return this.findEventMemberForUUIDCiphertext(event,
            maybeConstruct(authCredentialPresentation, AuthCredentialPresentation)
                .getUuidCiphertext())
    }

    private static findEventMemberForProfileKeyCredentialPresentation(event: GEventRecord,
                                                                      profileKeyCredentialPresentation: Uint8Array): GEventMemberRecord | undefined {
        return this.findEventMemberForUUIDCiphertext(event,
            maybeConstruct(profileKeyCredentialPresentation, ProfileKeyCredentialPresentation)
                .getUuidCiphertext())
    }

    async addEventMember(request: GAddEventMemberRequest) {
        const {event} = await this.authAsEventMember(request.getGroupidentifier_asU8(),
            request.getAuthcredentialpresentation_asU8());
        const groupPublicParams = construct(event.getGrouppublicparams_asU8(), GroupPublicParams);
        const newMemberProfileKeyCredentialPresentation = construct(request.getNewmemberprofilekeycredentialpresentation_asU8(),
            ProfileKeyCredentialPresentation);
        this.zkProfileOperations.verifyProfileKeyCredentialPresentation(groupPublicParams,
            newMemberProfileKeyCredentialPresentation);


        const addingMember = GatherServer.findEventMemberForAuthCredentialPresentation(event,
            request.getAuthcredentialpresentation_asU8());
        if (addingMember == undefined || !GatherServer.canAddMembers(event, addingMember))
            throw new Error("User cannot add members to this group");

        if (GatherServer.findEventMemberForProfileKeyCredentialPresentation(event,
            request.getNewmemberprofilekeycredentialpresentation_asU8()) !== undefined)
            throw new Error("User is already a member of this group");

        const newEventMemberRecord = new GEventMemberRecord();
        newEventMemberRecord.setProfilekeycredentialpresentation(request.getNewmemberprofilekeycredentialpresentation_asU8());
        newEventMemberRecord.setRole(request.getNewmemberrole()!);
        newEventMemberRecord.setState("");
        event.addMembers(newEventMemberRecord);

        await this.storage.updateEvent(event.getGroupidentifier_asU8(), event);
        return new Empty();
    }

    async setEventMemberState(request: GSetEventMemberStateRequest) {
        const {event, member} = await this.authAsEventMember(request.getGroupidentifier_asU8(),
            request.getAuthcredentialpresentation_asU8());

        member.setState(request.getNewstate());
        await this.storage.updateEvent(event.getGroupidentifier_asU8(), event);
        return new Empty();
    }

}

export class GatherServerWrapper implements IGatherServiceServer {

    constructor(private readonly server: GatherServer) {};

    private depromise<Req, Res>(promised: (request: Req) => Promise<Res>): (call: ServerUnaryCall<Req, Res>,
                                                                            callback: sendUnaryData<Res>) => void {
        return (call, callback) => {
            promised.bind(this.server)(call.request!)
                .then(value => callback(null, value))
                .catch((error: Error) => callback(error, null))
        };
    }

    addEventMember = this.depromise(this.server.addEventMember);
    createEvent = this.depromise(this.server.createEvent);
    createUser = this.depromise(this.server.createUser);
    fetchEvent = this.depromise(this.server.fetchEvent);
    getAuthCredential = this.depromise(this.server.getAuthCredential);
    getProfileKeyCredential = this.depromise(this.server.getProfileKeyCredential);
    getServerInfo = this.depromise(this.server.getServerInfo);
    setEventMemberState = this.depromise(this.server.setEventMemberState);

}
