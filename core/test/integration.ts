import GatherServer, {GatherServerWrapper} from "../src/server";
import {construct, deconstruct, hashString, nowRedemptionTime, randomCompatArray, usernameToUuid} from "../src/util";
import {
    AuthCredential,
    ClientZkAuthOperations,
    ClientZkProfileOperations,
    GroupPublicParams,
    GroupSecretParams,
    ProfileKey,
    ProfileKeyCredential,
    ServerPublicParams,
    ServerSecretParams
} from "zkgroup";
import chai, {expect} from "chai";
import {randomBytes} from "crypto";
import chaiAsPromised from "chai-as-promised";
import {InMemoryStorage} from "./testing_implementations";
import {credentials, Server, ServerCredentials} from "@grpc/grpc-js";
import {GatherServiceClient, GatherServiceService} from "../src/proto/gather_grpc_pb";
import {promisify} from 'util';
import {GEventMemberRole} from "../src/proto/gather_pb";
import {GatherClient} from "../src/client";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";

chai.use(chaiAsPromised);

describe("Integration Tests", async () => {

    const secretParams = ServerSecretParams.generate();

    const storage = new InMemoryStorage(secretParams);
    const server = new GatherServer(storage);
    const wrapped = new GatherServerWrapper(server);

    const grpcServer = new Server();
    // @ts-ignore
    grpcServer.addService(GatherServiceService, wrapped);
    await new Promise((resolve, reject) => {
      grpcServer.bindAsync("localhost:3030", ServerCredentials.createInsecure(), resolve);
    });
    grpcServer.start();

    const grpcClient = new GatherServiceClient("localhost:3030", credentials.createInsecure());
    const client = new GatherClient(grpcClient);

    let serverPublicParams: ServerPublicParams;
    let authOperations: ClientZkAuthOperations;
    let profileOperations: ClientZkProfileOperations;
    let groupSecretParams: GroupSecretParams;
    let groupPublicParams: GroupPublicParams;
    const user1 = {
        uuid: usernameToUuid("mr_bean"),
        password: hashString("somethin-stupid"),
        authCredential: undefined as (AuthCredential | undefined),
        profileKey: new ProfileKey(randomCompatArray(ProfileKey.SIZE)),
        profileKeyCredential: undefined as (ProfileKeyCredential | undefined),
    };

    const user2 = {
        uuid: usernameToUuid("someone_else"),
        password: hashString("another-stupid-thing"),
        authCredential: undefined as (AuthCredential | undefined),
        profileKey: new ProfileKey(randomCompatArray(ProfileKey.SIZE)),
        profileKeyCredential: undefined as (ProfileKeyCredential | undefined),

    }
    it('should return public params that match the provided secret params', async () => {
        const serverInfo = await client.getServerInfo(new Empty());
        expect(serverInfo.getPublicparams_asU8()).deep.equal(deconstruct(secretParams.getPublicParams()));
    });
    it('should correctly add a user to the storage', async () => {
        const profile = {
            content: new Uint8Array(20),
            key: user1.profileKey
        }

        const response = await client.createUser(user1.uuid, user1.password, profile);
        expect(response.success).to.be.true;
        const createdUser = await storage.findUserByUuid(user1.uuid);
        expect(createdUser).to.not.be.undefined;
        expect(createdUser?.getPasswordhash_asU8()).to.deep.equal(user1.password);
    });
    // it('should correctly authenticate', async () => {
    //     authOperations = new ClientZkAuthOperations(serverPublicParams);
    //     const authCredentialResponse = await client.getAuthCredential(user1.uuid, user1.password);
    //     user1.authCredential =
    //         authOperations.receiveAuthCredential(user1.uuid, nowRedemptionTime(), authCredentialResponse);
    //     expect(user1.authCredential).to.not.be.undefined;
    // });
    // it('should correctly get profile key credential', async () => {
    //     profileOperations = new ClientZkProfileOperations(serverPublicParams);
    //     const requestContext = profileOperations.createProfileKeyCredentialRequestContext(user1.uuid, user1.profileKey);
    //     const profileKeyCredentialResponse = await client.getProfileKeyCredential(user1.uuid,
    //         user1.profileKey.getProfileKeyVersion(user1.uuid), requestContext.getRequest());
    //
    //     user1.profileKeyCredential = profileOperations.receiveProfileKeyCredential(requestContext,
    //         profileKeyCredentialResponse);
    //
    //     expect(user1.profileKeyCredential).to.not.be.undefined;
    // });
    // it('should correctly create a new event', async () => {
    //     authOperations = new ClientZkAuthOperations(serverPublicParams);
    //     profileOperations = new ClientZkProfileOperations(serverPublicParams);
    //     groupSecretParams = GroupSecretParams.generate();
    //     groupPublicParams = groupSecretParams.getPublicParams();
    //     const groupContent = randomBytes(200);
    //     const authCredentialPresentation = authOperations.createAuthCredentialPresentation(groupSecretParams,
    //         user1.authCredential as AuthCredential);
    //     const profileKeyCredentialPresentation = profileOperations.createProfileKeyCredentialPresentation(
    //         groupSecretParams, user1.profileKeyCredential as ProfileKeyCredential);
    //     const response = await client.createEvent(groupPublicParams, groupContent, authCredentialPresentation, [
    //         {
    //             profileKeyCredentialPresentation: deconstruct(profileKeyCredentialPresentation),
    //             role: GEventMemberRole.CREATOR,
    //             state: randomBytes(50)
    //         }
    //     ]);
    //     expect(response.success).to.be.true;
    // });
    // it('should correctly fetch created event', async () => {
    //     const authCredentialPresentation = authOperations.createAuthCredentialPresentation(groupSecretParams,
    //         user1.authCredential as AuthCredential);
    //
    //     const response = await client.fetchEvent(groupPublicParams.getGroupIdentifier(), authCredentialPresentation);
    //     expect(response.groupIdentifier).to.deep.equal(deconstruct(groupPublicParams.getGroupIdentifier()));
    //     expect(response.members).to.not.be.undefined;
    //     expect(response.members?.length).to.equal(1);
    //     expect(response.members?.[0].role).to.equal(GEventMemberRole.CREATOR);
    // });
    // it('should fail to fetch event without proper authentication', async () => {
    //     expect((await client.createUser(user2.uuid, user2.password, {
    //         content: new Uint8Array(20),
    //         key: user2.profileKey
    //     })).success).to.be.true;
    //
    //     user2.authCredential =
    //         authOperations.receiveAuthCredential(user2.uuid, nowRedemptionTime(),
    //             await client.getAuthCredential(user2.uuid, user2.password));
    //     expect(user2.authCredential).to.not.be.undefined;
    //
    //     const invalidAuthCredentialPresentation = authOperations.createAuthCredentialPresentation(
    //         GroupSecretParams.generate(),
    //         user2.authCredential as AuthCredential);
    //
    //     const response = client.fetchEvent(groupPublicParams.getGroupIdentifier(),
    //         invalidAuthCredentialPresentation);
    //     expect(response).to.be.rejectedWith(Error);
    // });
    // it('should correctly add new member to existing group', async () => {
    //     const requestContext = profileOperations.createProfileKeyCredentialRequestContext(user2.uuid, user2.profileKey);
    //     const profileKeyCredentialResponse = await client.getProfileKeyCredential(user2.uuid,
    //         user2.profileKey.getProfileKeyVersion(user2.uuid), requestContext.getRequest());
    //
    //     user2.profileKeyCredential = profileOperations.receiveProfileKeyCredential(requestContext,
    //         profileKeyCredentialResponse);
    //
    //     const authCredentialPresentation = authOperations.createAuthCredentialPresentation(groupSecretParams,
    //         user1.authCredential as AuthCredential);
    //
    //     const newMemberPKCP = profileOperations.createProfileKeyCredentialPresentation(groupSecretParams, user2.profileKeyCredential);
    //     const addMemberResponse = await client.addEventMember(groupPublicParams.getGroupIdentifier(), authCredentialPresentation, newMemberPKCP, GEventMemberRole.DEFAULT);
    //     expect(addMemberResponse.success).to.be.true;
    //
    //     const fetchResponse = await client.fetchEvent(groupPublicParams.getGroupIdentifier(), authCredentialPresentation);
    //     expect(fetchResponse.members?.length).to.equal(2);
    // });
});

//
// const session = GatherOperations.session(server);
//
// console.log("create user mrbean:");
// const mrBeanProfile: ZkProfileInfo = {
//     name: "Mr Bean",
//     avatar: new Buffer(3)
// }
// const authenticatedSession = GatherOperations.createUser(session, "mrbean", "mypass", mrBeanProfile);
// console.log(authenticatedSession);
// console.log("did user create");
//
// console.log("create event bean party:")
// const beanPartyAccess = GatherOperations.createEvent(authenticatedSession, {name: "bean party", description: "get bean"});
// console.log(beanPartyAccess);
// console.log("did event create");
//
// console.log("fetch event bean party:")
// let beanParty = GatherOperations.fetchEvent(beanPartyAccess);
// console.log(beanParty);
// console.log("did event fetch");
// console.log("mrbean state at bean party:")
// console.log(beanParty.members.find(m => uuidsEqual(m.uuid, authenticatedSession.uuid))?.state);
//
// console.log("set mrbean state at bean party:")
// GatherOperations.setEventMemberState(beanPartyAccess, { seen: true, going: ZkEventMemberAttendance.GOING })
// console.log("did state set");
//
// console.log("fetch event bean party:")
// beanParty = GatherOperations.fetchEvent(beanPartyAccess);
// console.log(beanParty);
// console.log("did event fetch");
// console.log("mrbean state at bean party:")
// console.log(beanParty.members.find(m => uuidsEqual(m.uuid, authenticatedSession.uuid))?.state);

// });