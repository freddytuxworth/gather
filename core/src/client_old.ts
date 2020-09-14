// import {
//     AuthCredentialPresentation,
//     AuthCredentialResponse,
//     GroupIdentifier,
//     GroupPublicParams,
//     ProfileKey,
//     ProfileKeyCredentialPresentation,
//     ProfileKeyCredentialResponse,
//     ProfileKeyVersion,
//     ServerPublicParams
// } from "zkgroup";
//
// import {UUIDType} from "zkgroup/dist/zkgroup/internal/UUIDUtil";
// import ProfileKeyCredentialRequest from "zkgroup/dist/zkgroup/profiles/ProfileKeyCredentialRequest";
// import {GEventMemberRole, IGEventMemberRecord, IGEventRecord, IGOperationResult} from "./messages";
// import {construct, deconstruct} from "./util";
// import {GatherFetcher} from "./types";
//
// export const throwIfNull = <T>(object: T): NonNullable<T> => {
//     if(object == null)
//         throw new Error(`${typeof object} instance was unexpectedly null`);
//     return object!;
// }
//
// /**
//  * This class only implements suitable encoding of each request type for transport.
//  * It is not intended to perform other tasks which may be relevant, such as key generation or encryption. Those will
//  * be handled in GatherSession, which is the external API for the client-side code.
//  * To this end, each method of the class should have a parameter for each field of the message to be encoded.
//  */
// export class GatherClient {
//
//     private readonly transport: GatherFetcher;
//
//     constructor(transport: GatherFetcher) {
//         this.transport = transport;
//     }
//
//     async getAuthCredential(uuid: UUIDType, passwordHash: Buffer): Promise<AuthCredentialResponse> {
//         const rawResponse = await this.transport.doRequest({
//             authCredentialRequest: {uuid, passwordHash}
//         });
//
//         return construct(throwIfNull(rawResponse.authCredentialResponse).authCredentialResponse,
//             AuthCredentialResponse);
//     }
//
//     async getPublicParams(): Promise<ServerPublicParams> {
//         const rawResponse = await this.transport.doRequest({getPublicParamsRequest: {}});
//
//         return construct(throwIfNull(rawResponse.serverInfo).publicParams, ServerPublicParams);
//     }
//
//     async createUser(uuid: UUIDType, passwordHash: Buffer,
//                      profile: { content: Uint8Array, key: ProfileKey }): Promise<IGOperationResult> {
//         const rawResponse = await this.transport.doRequest({
//             createUserRequest: {
//                 uuid,
//                 passwordHash,
//                 profile: {
//                     content: profile.content,
//                     profileKeyVersion: deconstruct(profile.key.getProfileKeyVersion(uuid)),
//                     profileKeyCommitment: deconstruct(profile.key.getCommitment(uuid))
//                 }
//             }
//         });
//
//         return throwIfNull(rawResponse.result);
//     }
//
//     async getProfileKeyCredential(
//         uuid: UUIDType, profileKeyVersion: ProfileKeyVersion,
//         profileKeyCredentialRequest: ProfileKeyCredentialRequest
//     ): Promise<ProfileKeyCredentialResponse> {
//         const rawResponse = await this.transport.doRequest({
//             profileKeyCredentialRequest: {
//                 uuid,
//                 profileKeyVersion: deconstruct(profileKeyVersion),
//                 profileKeyCredentialRequest: deconstruct(profileKeyCredentialRequest)
//             }
//         });
//
//         return construct(throwIfNull(rawResponse.profileKeyCredentialResponse).profileKeyCredentialResponse,
//             ProfileKeyCredentialResponse);
//     }
//
//     async createEvent(
//         groupPublicParams: GroupPublicParams,
//         content: Uint8Array,
//         creatorAuthCredentialPresentation: AuthCredentialPresentation,
//         initialMembers: Array<IGEventMemberRecord>
//     ): Promise<IGOperationResult> {
//         const rawResponse = await this.transport.doRequest({
//             createEventRequest: {
//                 groupPublicParams: deconstruct(groupPublicParams),
//                 content,
//                 authCredentialPresentation: deconstruct(creatorAuthCredentialPresentation),
//                 initialMembers
//             }
//         });
//         return throwIfNull(rawResponse.result);
//     }
//
//     async fetchEvent(
//         groupIdentifier: GroupIdentifier,
//         authCredentialPresentation: AuthCredentialPresentation
//     ): Promise<IGEventRecord> {
//         const rawResponse = await this.transport.doRequest({
//             fetchEventRequest: {
//                 groupIdentifier: deconstruct(groupIdentifier),
//                 authCredentialPresentation: deconstruct(authCredentialPresentation)
//             }
//         });
//         return throwIfNull(rawResponse.event);
//     }
//
//     async addEventMember(
//         groupIdentifier: GroupIdentifier, authCredentialPresentation: AuthCredentialPresentation,
//         newMemberProfileKeyCredentialPresentation: ProfileKeyCredentialPresentation,
//         newMemberRole: GEventMemberRole
//     ): Promise<IGOperationResult> {
//         const rawResponse = await this.transport.doRequest({
//             addEventMemberRequest: {
//                 groupIdentifier: deconstruct(groupIdentifier),
//                 authCredentialPresentation: deconstruct(authCredentialPresentation),
//                 newMemberProfileKeyCredentialPresentation: deconstruct(newMemberProfileKeyCredentialPresentation),
//                 newMemberRole
//             }
//         });
//         return throwIfNull(rawResponse.result);
//     }
//
//     async setEventMemberState(
//         groupIdentifier: GroupIdentifier, authCredentialPresentation: AuthCredentialPresentation,
//         newState: Uint8Array
//     ): Promise<IGOperationResult> {
//         const rawResponse = await this.transport.doRequest({
//             setEventMemberStateRequest: {
//                 groupIdentifier: deconstruct(groupIdentifier),
//                 authCredentialPresentation: deconstruct(authCredentialPresentation),
//                 newState
//             }
//         });
//         return throwIfNull(rawResponse.result);
//     }
//
// }