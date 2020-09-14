import {
    AuthCredential,
    AuthCredentialResponse,
    ClientZkAuthOperations,
    ClientZkProfileOperations,
    GroupSecretParams,
    ProfileKey,
    ProfileKeyCredential,
    ProfileKeyCredentialResponse,
    ServerPublicParams
} from "zkgroup";

import {UUIDType} from "zkgroup/dist/zkgroup/internal/UUIDUtil";
import {construct, deconstruct, nowRedemptionTime} from "./util";
import {AsyncGatherService} from "./types";
import {
    GAddEventMemberRequest,
    GAuthCredentialRequest,
    GCreateEventRequest,
    GEventMemberRecord,
    GEventMemberRole,
    GEventRecord,
    GFetchEventRequest,
    GProfileKeyCredentialRequest,
    GProfileRecord,
    GSetEventMemberStateRequest,
    GUserRecord
} from "./proto/gather_pb";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {randomBytes} from "crypto";

export class GatherClient {

    private serverPublicParams: ServerPublicParams | undefined;
    private authOperations: ClientZkAuthOperations | undefined;
    private profileOperations: ClientZkProfileOperations | undefined;

    constructor(private readonly service: AsyncGatherService) {}

    async initialize() {
        this.serverPublicParams = await this.getPublicParams();
        this.authOperations = new ClientZkAuthOperations(this.serverPublicParams);
        this.profileOperations = new ClientZkProfileOperations(this.serverPublicParams);
    }

    async getAuthCredential(uuid: UUIDType, passwordHash: Buffer): Promise<AuthCredential> {
        const request = new GAuthCredentialRequest();
        request.setUuid(uuid);
        request.setPasswordhash(passwordHash);
        const response = await this.service.getAuthCredential(request);

        return this.authOperations!.receiveAuthCredential(uuid, nowRedemptionTime(),
            construct(response.getAuthcredentialresponse_asU8(), AuthCredentialResponse));
    }

    async getPublicParams(): Promise<ServerPublicParams> {
        const response = await this.service.getServerInfo(new Empty());

        return construct(response.getPublicparams_asU8(), ServerPublicParams);
    }

    async createUser(uuid: UUIDType, passwordHash: Buffer,
                     profile: { content: Uint8Array, key: ProfileKey }) {
        const request = new GUserRecord();
        request.setUuid(uuid);
        request.setPasswordhash(passwordHash);
        const newProfile = new GProfileRecord();
        newProfile.setContent(profile.content);
        newProfile.setProfilekeyversion(deconstruct(profile.key.getProfileKeyVersion(uuid)));
        newProfile.setProfilekeycommitment(deconstruct(profile.key.getCommitment(uuid)));
        request.setProfile(newProfile);
        const response = await this.service.createUser(request);
    }

    async getProfileKeyCredential(
        uuid: UUIDType, profileKey: ProfileKey
    ): Promise<ProfileKeyCredential> {
        const requestContext = this.profileOperations!.createProfileKeyCredentialRequestContext(uuid, profileKey);
        const profileKeyCredentialRequest = requestContext.getRequest();

        const request = new GProfileKeyCredentialRequest();
        request.setUuid(uuid);
        request.setProfilekeyversion(deconstruct(profileKey.getProfileKeyVersion(uuid)));
        request.setProfilekeycredentialrequest(deconstruct(profileKeyCredentialRequest));
        const rawResponse = await this.service.getProfileKeyCredential(request);
        const response = construct(rawResponse.getProfilekeycredentialresponse_asU8(), ProfileKeyCredentialResponse);

        return this.profileOperations!.receiveProfileKeyCredential(requestContext, response);
    }

    async createEvent(
        groupSecretParams: GroupSecretParams,
        content: Uint8Array,
        creatorAuthCredential: AuthCredential,
        creatorProfileKeyCredential: ProfileKeyCredential
    ) {
        const authCredentialPresentation = this.authOperations!.createAuthCredentialPresentation(groupSecretParams,
            creatorAuthCredential);
        const creatorProfileKeyCredentialPresentation = this.profileOperations!.createProfileKeyCredentialPresentation(
            groupSecretParams, creatorProfileKeyCredential);

        const creatorMember = new GEventMemberRecord();
        creatorMember.setRole(GEventMemberRole.CREATOR);
        creatorMember.setProfilekeycredentialpresentation(deconstruct(creatorProfileKeyCredentialPresentation));
        creatorMember.setState(randomBytes(50));

        const request = new GCreateEventRequest();
        request.setGrouppublicparams(deconstruct(groupSecretParams.getPublicParams()));
        request.setContent(content);
        request.setAuthcredentialpresentation(deconstruct(authCredentialPresentation));
        request.setInitialmembersList([creatorMember]);
        await this.service.createEvent(request);
    }

    async fetchEvent(
        groupSecretParams: GroupSecretParams,
        authCredential: AuthCredential
    ): Promise<GEventRecord> {
        const authCredentialPresentation = this.authOperations!.createAuthCredentialPresentation(groupSecretParams,
            authCredential);

        const request = new GFetchEventRequest();
        request.setGroupidentifier(deconstruct(groupSecretParams.getPublicParams().getGroupIdentifier()));
        request.setAuthcredentialpresentation(deconstruct(authCredentialPresentation));

        return await this.service.fetchEvent(request);
    }

    async addEventMember(
        groupSecretParams: GroupSecretParams, authCredential: AuthCredential,
        newMemberProfileKeyCredential: ProfileKeyCredential,
        newMemberRole: GEventMemberRole
    ) {
        const request = new GAddEventMemberRequest();
        request.setGroupidentifier(deconstruct(groupSecretParams.getPublicParams().getGroupIdentifier()));

        const newMemberProfileKeyCredentialPresentation = this.profileOperations!.createProfileKeyCredentialPresentation(
            groupSecretParams, newMemberProfileKeyCredential);
        const authCredentialPresentation = this.authOperations!.createAuthCredentialPresentation(groupSecretParams,
            authCredential);
        request.setAuthcredentialpresentation(deconstruct(authCredentialPresentation));
        request.setNewmemberprofilekeycredentialpresentation(deconstruct(newMemberProfileKeyCredentialPresentation));
        request.setNewmemberrole(newMemberRole);
        await this.service.addEventMember(request);
    }

    async setEventMemberState(
        groupSecretParams: GroupSecretParams,
        authCredential: AuthCredential,
        newState: Uint8Array
    ) {
        const authCredentialPresentation = this.authOperations!.createAuthCredentialPresentation(groupSecretParams,
            authCredential);

        const request = new GSetEventMemberStateRequest();
        request.setGroupidentifier(deconstruct(groupSecretParams.getPublicParams().getGroupIdentifier()));
        request.setAuthcredentialpresentation(deconstruct(authCredentialPresentation));
        request.setNewstate(newState);

        await this.service.setEventMemberState(request);
    }

}