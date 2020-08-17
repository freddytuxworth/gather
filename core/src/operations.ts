// import ZkEventServer from "./server";
// import {
//     ClientZkAuthOperations,
//     ClientZkGroupCipher,
//     ClientZkProfileOperations,
//     FFICompatArray,
//     GroupSecretParams,
//     ProfileKey,
//     ProfileKeyCredential
// } from "zkgroup";
// import {hashString, nowRedemptionTime, randomCompatArray, usernameToUuid} from "./util";
//
// import {UUIDType} from "zkgroup/dist/zkgroup/internal/UUIDUtil";
// import {GatherClient} from "./rest";
//
// export class GatherOperations {
//
//     static async session(client: GatherClient): Promise<UnauthenticatedSession> {
//         const publicParams = await client.getPublicParams();
//         return {
//             client,
//             serverPublicParams: publicParams,
//             authOperations: new ClientZkAuthOperations(publicParams),
//             profileOperations: new ClientZkProfileOperations(publicParams)
//         }
//
//     }
//
//     private static encryptProfile(uuid: UUIDType, profileKey: ProfileKey, profile: ZkProfileInfo): ZkProfileRecord {
//         //TODO ENCRYPT
//         return {
//             data: new Buffer(profile.name),
//             version: profileKey.getProfileKeyVersion(uuid),
//             commitment: profileKey.getCommitment(uuid)
//         };
//     }
//
//     static createUser(session: UnauthenticatedSession, username: string, password: string,
//                       profile: ZkProfileInfo): Promise<AuthenticatedSession> {
//         const uuid = usernameToUuid(username);
//         const profileKey = new ProfileKey(randomCompatArray(ProfileKey.SIZE));
//         const profileRecord = this.encryptProfile(uuid, profileKey, profile);
//
//         session.client.createUser(uuid, hashString(password), profileRecord);
//
//         return this.authenticate(session, uuid, password, profileKey);
//     }
//
//     private static async getProfileKeyCredential(session: UnauthenticatedSession, uuid: UUIDType,
//                                                  profileKey: ProfileKey): Promise<ProfileKeyCredential> {
//         const profileKeyCredentialRequestContext = session.profileOperations.createProfileKeyCredentialRequestContext(
//             uuid, profileKey);
//
//         return session.profileOperations.receiveProfileKeyCredential(
//             profileKeyCredentialRequestContext,
//             await session.client.getProfileKeyCredential(uuid, profileKey.getProfileKeyVersion(uuid),
//                 profileKeyCredentialRequestContext.getRequest()));
//     }
//
//     private static async authenticate(session: UnauthenticatedSession, uuid: UUIDType,
//                                 password: string, profileKey: ProfileKey): Promise<AuthenticatedSession> {
//         const authCredential = session.authOperations.receiveAuthCredential(
//             uuid, nowRedemptionTime(), await session.client.getAuthCredential(uuid, hashString(password)));
//
//         const profileKeyCredential = await this.getProfileKeyCredential(session, uuid, profileKey);
//
//         return {
//             ...session,
//             uuid,
//             authCredential,
//             profileKey,
//             profileKeyCredential
//         };
//     }
//
//     static async createEvent(session: AuthenticatedSession, details: ZkEventDetails): Promise<ZkEventAccess> {
//         const groupSecretParams = GroupSecretParams.generate();
//         const eventAccess = this.getEventAccess(session, groupSecretParams);
//         const profileKeyCredentialPresentation = session.profileOperations.createProfileKeyCredentialPresentation(
//             groupSecretParams, session.profileKeyCredential);
//
//         const groupCipher = new ClientZkGroupCipher(groupSecretParams);
//         const encryptedDetails = groupCipher.encryptBlob(FFICompatArray(new Buffer(JSON.stringify(details))));
//
//         const selfMember: ZkEventMemberRecord = {
//             profileKeyCredentialPresentation,
//             role: ZkEventMemberRole.CREATOR,
//             state: this.encrypt<ZkEventMemberState>(groupCipher, {
//                 seen: false,
//                 going: ZkEventMemberAttendance.UNKNOWN
//             })
//         }
//
//         await session.client.createEvent(
//             eventAccess.groupPublicParams,
//             encryptedDetails,
//             eventAccess.authCredentialPresentation,
//             [selfMember]
//         );
//
//         return eventAccess;
//     }
//
//     private static encrypt<T>(cipher: ClientZkGroupCipher, object: T): EncryptedValue<T> {
//         return cipher.encryptBlob(FFICompatArray(new Buffer(JSON.stringify(object)))).buffer;
//     }
//
//     private static decrypt<T>(cipher: ClientZkGroupCipher, encrypted: EncryptedValue<T>): T {
//         return JSON.parse(cipher.decryptBlob(FFICompatArray(encrypted)).buffer.toString('utf-8'));
//     }
//
//     static getEventAccess(session: AuthenticatedSession, groupSecretParams: GroupSecretParams): ZkEventAccess {
//         const groupPublicParams = groupSecretParams.getPublicParams();
//         const authCredentialPresentation = session.authOperations.createAuthCredentialPresentation(
//             groupSecretParams,
//             session.authCredential);
//         return {
//             session,
//             identifier: groupPublicParams.getGroupIdentifier(),
//             groupSecretParams,
//             groupPublicParams,
//             authCredentialPresentation,
//             groupCipher: new ClientZkGroupCipher(groupSecretParams)
//         }
//     }
//
//     private static decryptEventMember(cipher: ClientZkGroupCipher,
//                                       encryptedMember: ZkEventMemberRecord): ZkEventMemberInfo {
//         const uuid = cipher.decryptUuid(
//             encryptedMember.profileKeyCredentialPresentation.getUuidCiphertext());
//         const profileKey = cipher.decryptProfileKey(
//             encryptedMember.profileKeyCredentialPresentation.getProfileKeyCiphertext(), uuid);
//         const state = encryptedMember.state != undefined ?
//             this.decrypt<ZkEventMemberState>(cipher, encryptedMember.state) : ZkEventMemberInitialState;
//
//         return {uuid, profileKey, role: encryptedMember.role, state};
//     }
//
//     static async fetchEvent(eventAccess: ZkEventAccess): Promise<ZkEventInfo> {
//         const fetched = await eventAccess.session.client.fetchEvent(eventAccess.identifier,
//             eventAccess.authCredentialPresentation);
//         return {
//             details: this.decrypt<ZkEventDetails>(eventAccess.groupCipher, fetched.data),
//             members: fetched.members.map(
//                 encryptedMember => this.decryptEventMember(eventAccess.groupCipher, encryptedMember))
//         }
//     }
//
//     static async addEventMember(eventAccess: ZkEventAccess, uuid: UUIDType, profileKey: ProfileKey,
//                                 role: ZkEventMemberRole) {
//         const profileKeyCredential = await this.getProfileKeyCredential(eventAccess.session, uuid, profileKey);
//         const profileKeyCredentialPresentation = eventAccess.session.profileOperations.createProfileKeyCredentialPresentation(
//             eventAccess.groupSecretParams, profileKeyCredential);
//
//         await eventAccess.session.client.addEventMember(eventAccess.identifier, eventAccess.authCredentialPresentation,
//             profileKeyCredentialPresentation, role);
//     }
//
//     static setEventMemberState(eventAccess: ZkEventAccess, newState: ZkEventMemberState) {
//         eventAccess.session.client.setEventMemberState(eventAccess.identifier, eventAccess.authCredentialPresentation,
//             this.encrypt<ZkEventMemberState>(eventAccess.groupCipher, newState));
//     }
// }
