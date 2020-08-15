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
import GatherServer, {GatherResponse} from "./server";
import {
    GatherError,
    GatherRequest,
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

export function serializingLayer(transport: GatherTransport): GatherTransport {
    return {
        doRequest: async <T extends GatherResponse>(request: IGatherRequest) => {
            const serialized = GatherRequest.encode(request).finish();
            const deserialized = GatherRequest.decode(serialized);
            return transport.doRequest(deserialized);
        }

    }
}

export function localTransport(server: GatherServer): GatherTransport {
    return {
        doRequest: async <T extends GatherResponse>(request: IGatherRequest) => {
            const response = await server.handleRequest(request);
            if (response instanceof GatherError)
                throw new Error(response.error);
            return response as T;
        }
    }
}

//
// export class GatherHttpTransport implements GatherTransport {
//     private readonly apiClient: AxiosInstance;
//
//     constructor(baseUrl: string) {
//         this.apiClient = axios.create({
//             baseURL: baseUrl,
//             responseType: 'json',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//     }
//
//     private static decodeResponseForRequest(request: IGatherRequest, response: Uint8Array): GatherResponse {
//         const result =
//         if (request.getPublicParamsRequest)
//             return GServerInfo.decode(response);
//         if (request.createUserRequest)
//             return GOperationResult.decode(response);
//         if (request.authCredentialRequest)
//             return GAuthCredentialResponse.decode(response);
//         if (request.profileKeyCredentialRequest)
//             return GProfileKeyCredentialResponse.decode(response);
//         if (request.createEventRequest)
//             return GOperationResult.decode(response);
//         if (request.fetchEventRequest)
//             return GEventRecord.decode(response);
//         if (request.addEventMemberRequest)
//             return GOperationResult.decode(response);
//         if (request.setEventMemberStateRequest)
//             return GOperationResult.decode(response);
//         throw new Error("Didn't know what response to expect.");
//     }
//
//     doRequest<T extends GatherResponse>(request: IGatherRequest): Promise<T> {
//         const encoded = GatherRequest.encode(request).finish();
//         return this.apiClient.post<Uint8Array>("/api", encoded, {responseType: "arraybuffer"})
//             .then(response => response.data)
//             .then(data => GatherHttpTransport.decodeResponseForRequest(request, data) as unknown as T);
//     }
// }

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
                    profileKeyVersion: {content: deconstruct(profile.key.getProfileKeyVersion(uuid))},
                    profileKeyCommitment: {content: deconstruct(profile.key.getCommitment(uuid))}
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
                profileKeyVersion: {content: deconstruct(profileKeyVersion)},
                profileKeyCredentialRequest: {content: deconstruct(profileKeyCredentialRequest)}
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
                groupPublicParams: {content: deconstruct(groupPublicParams)},
                content,
                authCredentialPresentation: {content: deconstruct(creatorAuthCredentialPresentation)},
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
                groupIdentifier: {content: deconstruct(groupIdentifier)},
                authCredentialPresentation: {content: deconstruct(authCredentialPresentation)}
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
                groupIdentifier: {content: deconstruct(groupIdentifier)},
                authCredentialPresentation: {content: deconstruct(authCredentialPresentation)},
                newMemberProfileKeyCredentialPresentation: {
                    content: deconstruct(newMemberProfileKeyCredentialPresentation)
                },
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
                groupIdentifier: {content: deconstruct(groupIdentifier)},
                authCredentialPresentation: {content: deconstruct(authCredentialPresentation)},
                newState
            }
        });
    }

}
