import {
    GEventRecord,
    google, GUserRecord, IGatherRequest,
    IGAuthCredentialResponse,
    IGEventRecord,
    IGOperationResult,
    IGProfileKeyCredentialResponse,
    IGServerInfo, IGUserRecord
} from "./messages";
import IEmpty = google.protobuf.IEmpty;
import {ServerSecretParams} from "zkgroup";

export type GAuthCredentialPresentation = Uint8Array;
export type GGroupIdentifier = Uint8Array;
export type GProfileKeyCredentialPresentation = Uint8Array;

export type GatherResponse =
    IEmpty
    | IGOperationResult
    | IGServerInfo
    | IGAuthCredentialResponse
    | IGProfileKeyCredentialResponse
    | IGEventRecord;

export type GatherStorage = {
    saveSecretParams: (secretParams: ServerSecretParams) => Promise<void>,
    getSecretParams: () => ServerSecretParams,
    findUserByUuid: (uuid: string) => Promise<GUserRecord>,
    addUser: (newUser: IGUserRecord | GUserRecord) => Promise<void>,
    findEventByIdentifier: (identifier: GGroupIdentifier) => Promise<GEventRecord>,
    addEvent: (newEvent: IGEventRecord | GEventRecord) => Promise<void>
    updateEvent: (identifier: GGroupIdentifier,
                  newEvent: IGEventRecord | GEventRecord) => Promise<void>
}

export type GatherTransport = {
    doRequest: <T extends GatherResponse>(request: IGatherRequest) => Promise<T>
};


// import {
//     AuthCredential,
//     AuthCredentialPresentation, ClientZkAuthOperations,
//     ClientZkGroupCipher, ClientZkProfileOperations, FFICompatArrayType, GroupIdentifier,
//     GroupPublicParams,
//     GroupSecretParams, ProfileKey,
//     ProfileKeyCommitment, ProfileKeyCredential,
//     ProfileKeyCredentialPresentation,
//     ProfileKeyVersion, ServerPublicParams
// } from "zkgroup";
// import {UUIDType} from "zkgroup/dist/zkgroup/internal/UUIDUtil";
// import ZkEventServer from "./server";
// import {ZkEventClient} from "./rest";
// import {GEventMemberAttendance, GEventMemberRole} from "./messages";
//
// // export interface GatherSocket {
// //     sendToServer: ()
// // }
//
// export type EncryptedValue<T> = Buffer;
//
// export type UnauthenticatedSession = {
//     client: ZkEventClient,
//     serverPublicParams: ServerPublicParams,
//     authOperations: ClientZkAuthOperations,
//     profileOperations: ClientZkProfileOperations
// }
//
// export type AuthenticatedSession = UnauthenticatedSession & {
//     uuid: string,
//     authCredential: AuthCredential,
//     profileKey: ProfileKey,
//     profileKeyCredential: ProfileKeyCredential,
// }
//
// export type SEventMemberState = {
//     seen: boolean,
//     going: GEventMemberAttendance
// }
//
// export const SEventMemberInitialState: SEventMemberState = {
//     seen: false,
//     going: GEventMemberAttendance.UNKNOWN
// }
//
// export type SEventMemberRecord = {
//     profileKeyCredentialPresentation: ProfileKeyCredentialPresentation,
//     role: GEventMemberRole,
//     state?: EncryptedValue<SEventMemberState>
// }
//
// export type SEventRecord = {
//     groupPublicParams: GroupPublicParams,
//     members: Array<SEventMemberRecord>,
//     content: EncryptedValue<SEventDetails>
// }
//
// export type SProfileInfo = {
//     name: string,
//     avatar: Buffer
// }
//
// export type SProfileRecord = {
//     content: EncryptedValue<SProfileInfo>,
//     version: ProfileKeyVersion,
//     commitment: ProfileKeyCommitment
// }
//
// export type ZkUserRecord = {
//     uuid: UUIDType,
//     passwordHash: Buffer,
//     profileRecord: SProfileRecord
// }
//
// // Holds all information needed to access a group
// export type SEventAccess = {
//     session: AuthenticatedSession
//     identifier: GroupIdentifier,
//     groupSecretParams: GroupSecretParams,
//     groupPublicParams: GroupPublicParams,
//     authCredentialPresentation: AuthCredentialPresentation,
//     groupCipher: ClientZkGroupCipher
// }
//
// export type SEventDetails = {
//     name: string,
//     description: string
// }
//
// export type SEventInfo = {
//     details: SEventDetails,
//     members: Array<SEventMemberInfo>
// }
//
// export type SEventMemberInfo = {
//     uuid: UUIDType,
//     profileKey: ProfileKey,
//     role: SEventMemberRole,
//     state: SEventMemberState
// }
//
// export type OperationResult = {
//     success: true
// } | {
//     success: false,
//     err: string
// }