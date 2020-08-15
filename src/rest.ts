import {
    AuthCredentialPresentation,
    AuthCredentialResponse,
    GroupIdentifier,
    GroupPublicParams,
    ProfileKey,
    ProfileKeyCredentialPresentation,
    ProfileKeyCredentialResponse,
    ProfileKeyVersion,
    ServerPublicParams
} from "zkgroup";

import {UUIDType} from "zkgroup/dist/zkgroup/internal/UUIDUtil";
import ProfileKeyCredentialRequest from "zkgroup/dist/zkgroup/profiles/ProfileKeyCredentialRequest";
import {GatherResponse} from "./server";
import {
    GEventMemberRole,
    IGatherRequest,
    IGAuthCredentialResponse,
    IGEventMemberRecord,
    IGEventRecord,
    IGOperationResult,
    IGProfileKeyCredentialResponse,
    IGServerInfo
} from "./messages";
import {construct, deconstruct} from "./util";

export type GatherTransport = {
    doRequest: <T extends GatherResponse>(request: IGatherRequest) => Promise<T>
};

export class GatherClient {

    private readonly transport: GatherTransport;

    constructor(transport: GatherTransport) {
        this.transport = transport;
    }

    // private async fetchTyped<K extends keyof GatherOperationResponse>(request: GatherRequest, field: K) {
    //     const rawResponse = await this.transport.doRequest(request);
    //     return rawResponse[field];
    // }

    async getAuthCredential(uuid: UUIDType, passwordHash: Buffer): Promise<AuthCredentialResponse> {
        const rawResponse = await this.transport.doRequest<IGAuthCredentialResponse>({
            authCredentialRequest: {uuid, passwordHash}
        });

        return construct(rawResponse.authCredentialResponse, AuthCredentialResponse);
    }

    async getPublicParams(): Promise<ServerPublicParams> {
        const rawResponse = await this.transport.doRequest<IGServerInfo>({getPublicParamsRequest: {}});

        return construct(rawResponse.publicParams, ServerPublicParams);
    }

    async createUser(uuid: UUIDType, passwordHash: Buffer,
                     profile: { content: Uint8Array, key: ProfileKey }) {
        return await this.transport.doRequest<IGOperationResult>({
            createUserRequest: {
                uuid,
                passwordHash,
                profile: {
                    content: profile.content,
                    profileKeyVersion: deconstruct(profile.key.getProfileKeyVersion(uuid)),
                    profileKeyCommitment: deconstruct(profile.key.getCommitment(uuid))
                }
            }
        });
    }

    async getProfileKeyCredential(
        uuid: UUIDType, profileKeyVersion: ProfileKeyVersion,
        profileKeyCredentialRequest: ProfileKeyCredentialRequest
    ): Promise<ProfileKeyCredentialResponse> {
        const rawResponse = await this.transport.doRequest<IGProfileKeyCredentialResponse>({
            profileKeyCredentialRequest: {
                uuid,
                profileKeyVersion: deconstruct(profileKeyVersion),
                profileKeyCredentialRequest: deconstruct(profileKeyCredentialRequest)
            }
        });

        return construct(rawResponse.profileKeyCredentialResponse, ProfileKeyCredentialResponse);
    }

    async createEvent(
        groupPublicParams: GroupPublicParams,
        content: Uint8Array,
        creatorAuthCredentialPresentation: AuthCredentialPresentation,
        initialMembers: Array<IGEventMemberRecord>
    ): Promise<IGOperationResult> {
        return await this.transport.doRequest<IGOperationResult>({
            createEventRequest: {
                groupPublicParams: deconstruct(groupPublicParams),
                content,
                authCredentialPresentation: deconstruct(creatorAuthCredentialPresentation),
                initialMembers
            }
        });
    }

    async fetchEvent(
        groupIdentifier: GroupIdentifier,
        authCredentialPresentation: AuthCredentialPresentation
    ): Promise<IGEventRecord> {
        return await this.transport.doRequest<IGEventRecord>({
            fetchEventRequest: {
                groupIdentifier: deconstruct(groupIdentifier),
                authCredentialPresentation: deconstruct(authCredentialPresentation)
            }
        });
    }

    async addEventMember(
        groupIdentifier: GroupIdentifier, authCredentialPresentation: AuthCredentialPresentation,
        newMemberProfileKeyCredentialPresentation: ProfileKeyCredentialPresentation,
        newMemberRole: GEventMemberRole
    ): Promise<IGOperationResult> {
        return await this.transport.doRequest<IGOperationResult>({
            addEventMemberRequest: {
                groupIdentifier: deconstruct(groupIdentifier),
                authCredentialPresentation: deconstruct(authCredentialPresentation),
                newMemberProfileKeyCredentialPresentation: deconstruct(newMemberProfileKeyCredentialPresentation),
                newMemberRole
            }
        });
    }

    async setEventMemberState(
        groupIdentifier: GroupIdentifier, authCredentialPresentation: AuthCredentialPresentation,
        newState: Uint8Array
    ): Promise<IGOperationResult> {
        return await this.transport.doRequest<IGOperationResult>({
            setEventMemberStateRequest: {
                groupIdentifier: deconstruct(groupIdentifier),
                authCredentialPresentation: deconstruct(authCredentialPresentation),
                newState
            }
        });
    }

}
