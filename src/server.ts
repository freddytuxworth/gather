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
import ZkGroupError from "zkgroup/dist/zkgroup/errors/ZkGroupError";

import {
    areEqual,
    construct,
    deconstruct,
    maybeConstruct,
    nowRedemptionTime,
    operationSuccess,
    typedArraysEqual
} from "./util";
import {
    GatherError,
    GatherService,
    GAuthCredentialResponse,
    GEventMemberRecord,
    GEventMemberRole,
    GEventRecord,
    GProfileKeyCredentialResponse,
    GServerInfo,
    GUserRecord,
    IGAddEventMemberRequest,
    IGatherRequest,
    IGAuthCredentialRequest,
    IGAuthCredentialResponse,
    IGCreateEventRequest,
    IGCreateUserRequest,
    IGEventMemberRecord,
    IGEventRecord,
    IGFetchEventRequest,
    IGOperationResult,
    IGProfileKeyCredentialRequest,
    IGProfileKeyCredentialResponse,
    IGServerInfo,
    IGSetEventMemberStateRequest,
} from "./messages";

import ProfileKeyCredentialRequest from "zkgroup/dist/zkgroup/profiles/ProfileKeyCredentialRequest";
import {GatherStorage} from "./storage";
import {GAuthCredentialPresentation, GGroupIdentifier, GProfileKeyCredentialPresentation} from "./types";

export type GatherResponse =
    {}
    | IGOperationResult
    | IGServerInfo
    | IGAuthCredentialResponse
    | IGProfileKeyCredentialResponse
    | IGEventRecord;

type SubType<Base, Condition> = Pick<Base, {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type GatherServerApi = SubType<GatherService, (...args: any[]) => Promise<any>>

export default class GatherServer implements GatherServerApi {
    private readonly storage: GatherStorage;
    private readonly secretParams: ServerSecretParams;
    private readonly publicParams: ServerPublicParams;
    private readonly zkAuthOperations: ServerZkAuthOperations;
    private readonly zkProfileOperations: ServerZkProfileOperations;

    constructor(storage: GatherStorage) {
        this.storage = storage;
        this.secretParams = storage.getSecretParams();
        this.publicParams = this.secretParams.getPublicParams();
        this.zkAuthOperations = new ServerZkAuthOperations(this.secretParams);
        this.zkProfileOperations = new ServerZkProfileOperations(this.secretParams);
    }

    async handleRequest(request: IGatherRequest): Promise<GatherResponse | GatherError> {
        try {
            if (request.getPublicParamsRequest)
                return this.getPublicParams();
            if (request.createUserRequest)
                return this.createUser(request.createUserRequest);
            if (request.authCredentialRequest)
                return this.getAuthCredential(request.authCredentialRequest);
            if (request.profileKeyCredentialRequest)
                return this.getProfileKeyCredential(request.profileKeyCredentialRequest);
            if (request.createEventRequest)
                return this.createEvent(request.createEventRequest);
            if (request.fetchEventRequest)
                return this.fetchEvent(request.fetchEventRequest);
            if (request.addEventMemberRequest)
                return this.addEventMember(request.addEventMemberRequest);
            if (request.setEventMemberStateRequest)
                return this.setEventMemberState(request.setEventMemberStateRequest);
        } catch (error) {
            return new GatherError({error});
        }
        return new GatherError({error: "Unidentified request"});
    }

    async createUser(request: IGCreateUserRequest) {
        const userExists = await this.storage.findUserByUuid(request.uuid).then(() => true).catch(() => false);
        if (userExists)
            throw new Error("UUID already exists");
        await this.storage.addUser(new GUserRecord({...request}));
        return operationSuccess;
    }

    async getPublicParams() {
        return new GServerInfo({
            publicParams: deconstruct(this.publicParams)
        });
    }

    async getAuthCredential(request: IGAuthCredentialRequest) {
        const user = await this.storage.findUserByUuid(request.uuid);
        if (user === undefined)
            throw new ZkGroupError("User not found");
        if (!typedArraysEqual(user.passwordHash, request.passwordHash))
            throw new ZkGroupError("Authentication failed.");

        return new GAuthCredentialResponse({
            authCredentialResponse: deconstruct(
                this.zkAuthOperations.issueAuthCredential(request.uuid, nowRedemptionTime()))
        });
    }

    async getProfileKeyCredential(request: IGProfileKeyCredentialRequest) {
        const user = await this.storage.findUserByUuid(request.uuid);

        if (!typedArraysEqual(user.profile.profileKeyVersion, request.profileKeyVersion))
            throw new ZkGroupError("User profile key not correct");

        const pKCR = construct(request.profileKeyCredentialRequest, ProfileKeyCredentialRequest)
        const pKC = construct(user.profile.profileKeyCommitment, ProfileKeyCommitment);

        //TODO: does this verify the PoK in the ProfileKeyCredentialRequest?
        const profileKeyCredentialResponse = this.zkProfileOperations.issueProfileKeyCredential(pKCR,
            request.uuid, pKC);

        return new GProfileKeyCredentialResponse({
            profileKeyCredentialResponse: deconstruct(profileKeyCredentialResponse)
        });
    }

    async createEvent(request: IGCreateEventRequest) {
        const groupPublicParams = construct(request.groupPublicParams, GroupPublicParams);
        const creatorAuthCredentialPresentation = construct(request.authCredentialPresentation,
            AuthCredentialPresentation);

        this.zkAuthOperations.verifyAuthCredentialPresentation(groupPublicParams, creatorAuthCredentialPresentation);
        const profileKeyCredentialPresentations = request.initialMembers
            ? request.initialMembers.map(initialMember =>
                construct(initialMember.profileKeyCredentialPresentation, ProfileKeyCredentialPresentation))
            : [];

        profileKeyCredentialPresentations.forEach(pKCP =>
            this.zkProfileOperations.verifyProfileKeyCredentialPresentation(groupPublicParams, pKCP));

        if (!profileKeyCredentialPresentations.some(
            pKCP => areEqual(pKCP.getUuidCiphertext(), creatorAuthCredentialPresentation.getUuidCiphertext())))
            throw new ZkGroupError('Creator UUID ciphertext is not present in initial members list.');

        await this.storage.addEvent({
            groupIdentifier: deconstruct(groupPublicParams.getGroupIdentifier()),
            groupPublicParams: request.groupPublicParams,
            content: request.content,
            members: request.initialMembers
        });

        return operationSuccess;
    }

    private async authAsEventMember(groupIdentifier: GGroupIdentifier,
                                    authCredentialPresentation: GAuthCredentialPresentation) {
        const event = await this.storage.findEventByIdentifier(groupIdentifier);
        if (event === undefined)
            throw new ZkGroupError('No such event');

        const member = this.findEventMemberForAuthCredentialPresentation(event, authCredentialPresentation);
        if (member === undefined)
            throw new ZkGroupError("User is not in group.");

        return {event, member: new GEventMemberRecord(member)};
    }

    async fetchEvent(request: IGFetchEventRequest) {
        const {event} = await this.authAsEventMember(request.groupIdentifier, request.authCredentialPresentation);
        if (event === undefined)
            throw new ZkGroupError('Group could not be fetched.');
        return new GEventRecord(event);
    }

    private static canAddMembers(event: IGEventRecord, member: IGEventMemberRecord) {
        // TODO
        return member.role == GEventMemberRole.CREATOR;
    }

    private findEventMemberForUUIDCiphertext(event: IGEventRecord, uuidCiphertext: UuidCiphertext) {
        return event.members?.find(
            member => areEqual(construct(member.profileKeyCredentialPresentation, ProfileKeyCredentialPresentation)
                .getUuidCiphertext(), uuidCiphertext))
    }

    private findEventMemberForAuthCredentialPresentation(event: IGEventRecord,
                                                         authCredentialPresentation: AuthCredentialPresentation | GAuthCredentialPresentation) {
        return this.findEventMemberForUUIDCiphertext(event,
            maybeConstruct(authCredentialPresentation, AuthCredentialPresentation)
                .getUuidCiphertext())
    }

    private findEventMemberForProfileKeyCredentialPresentation(event: IGEventRecord,
                                                               profileKeyCredentialPresentation: ProfileKeyCredentialPresentation | GProfileKeyCredentialPresentation) {
        return this.findEventMemberForUUIDCiphertext(event,
            maybeConstruct(profileKeyCredentialPresentation, ProfileKeyCredentialPresentation)
                .getUuidCiphertext())
    }

    async addEventMember(request: IGAddEventMemberRequest) {
        const {event} = await this.authAsEventMember(request.groupIdentifier,
            request.authCredentialPresentation);
        const groupPublicParams = construct(event.groupPublicParams, GroupPublicParams);
        const newMemberProfileKeyCredentialPresentation = construct(request.newMemberProfileKeyCredentialPresentation,
            ProfileKeyCredentialPresentation);
        this.zkProfileOperations.verifyProfileKeyCredentialPresentation(groupPublicParams,
            newMemberProfileKeyCredentialPresentation);


        const addingMember = this.findEventMemberForAuthCredentialPresentation(event,
            request.authCredentialPresentation);
        if (addingMember == undefined || !GatherServer.canAddMembers(event, addingMember))
            throw new ZkGroupError("User cannot add members to this group");

        if (this.findEventMemberForProfileKeyCredentialPresentation(event,
            request.newMemberProfileKeyCredentialPresentation) !== undefined)
            throw new ZkGroupError("User is already a member of this group");


        event.members?.push({
            profileKeyCredentialPresentation: request.newMemberProfileKeyCredentialPresentation,
            role: request.newMemberRole,
            state: undefined
        });

        await this.storage.updateEvent(event.groupIdentifier, event);
        return operationSuccess;
    }

    async setEventMemberState(request: IGSetEventMemberStateRequest) {
        const {event, member} = await this.authAsEventMember(request.groupIdentifier,
            request.authCredentialPresentation);

        member.state = request.newState;
        await this.storage.updateEvent(event.groupIdentifier, event);
        return operationSuccess;
    }

}

