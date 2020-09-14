import GatherServer from "../src/server";
import {deconstruct, hashString, randomCompatArray, typedArraysEqual, usernameToUuid} from "../src/util";
import {
    AuthCredential,
    GroupPublicParams,
    GroupSecretParams,
    ProfileKey,
    ProfileKeyCredential,
    ServerSecretParams
} from "zkgroup";
import chai, {assert, expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import {InMemoryStorage} from "./testing_implementations";
import {createGatherGrpcConnection, createGatherGrpcServer} from "../src/grpc";
import {GatherClient} from "../src/client";
import {randomBytes} from "crypto";
import {GEventMemberRole} from "../src/proto/gather_pb";

chai.use(chaiAsPromised);

describe("Integration Tests", async () => {

    const secretParams = ServerSecretParams.generate();

    const storage = new InMemoryStorage(secretParams);
    const server = new GatherServer(storage);

    const grpcServer = await createGatherGrpcServer(server, "localhost:3030");
    grpcServer.start();

    const connection = createGatherGrpcConnection("localhost:3030");
    const client = new GatherClient(connection);
    before(async () => client.initialize());

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
        const publicParams = await client.getPublicParams();
        expect(deconstruct(publicParams)).deep.equal(deconstruct(secretParams.getPublicParams()));
    });
    it('should correctly create a new a user and add to the storage', async () => {
        await client.createUser(user1.uuid, user1.password, {content: new Uint8Array(20), key: user1.profileKey});

        const createdUser = await storage.findUserByUuid(user1.uuid);
        expect(createdUser).to.not.be.undefined;
        expect(createdUser?.getPasswordhash_asU8()).to.deep.equal(user1.password);
    });
    it('should correctly authenticate', async () => {
        user1.authCredential = await client.getAuthCredential(user1.uuid, user1.password);
        expect(user1.authCredential).to.not.be.undefined;
    });
    it('should reject with incorrect password', async () => {
        await assert.isRejected(client.getAuthCredential(user1.uuid, hashString("wrong password")));
    });
    it('should correctly get profile key credential', async () => {
        user1.profileKeyCredential = await client.getProfileKeyCredential(user1.uuid, user1.profileKey);

        expect(user1.profileKeyCredential).to.not.be.undefined;
    });
    it('should correctly create a new event', async () => {
        groupSecretParams = GroupSecretParams.generate();
        groupPublicParams = groupSecretParams.getPublicParams();
        const groupContent = randomBytes(200);
        await client.createEvent(groupSecretParams, groupContent, user1.authCredential!, user1.profileKeyCredential!);
    });
    it('should correctly fetch created event', async () => {
        const response = await client.fetchEvent(groupSecretParams, user1.authCredential!);
        expect(response.getGroupidentifier_asU8()).to.deep.equal(deconstruct(groupPublicParams.getGroupIdentifier()));
        expect(response.getMembersList().length).to.equal(1);
        expect(response.getMembersList()?.[0].getRole()).to.equal(GEventMemberRole.CREATOR);
    });
    it('should fail to fetch event with incorrect auth credential', async () => {
        await client.createUser("other uuid", hashString("other password"),
            {content: new Uint8Array(20), key: new ProfileKey(randomCompatArray(ProfileKey.SIZE))});
        const wrongAuthCredential = await client.getAuthCredential("other uuid", hashString("other password"));

        await assert.isRejected(client.fetchEvent(groupSecretParams, wrongAuthCredential));
    });
    it('should correctly add new member to existing group', async () => {
        await client.createUser(user2.uuid, user2.password, {content: new Uint8Array(20), key: user2.profileKey});
        const newMemberProfileKeyCredential = await client.getProfileKeyCredential(user2.uuid, user2.profileKey);
        await client.addEventMember(groupSecretParams, user1.authCredential!, newMemberProfileKeyCredential, GEventMemberRole.DEFAULT);
    });
    it('should correctly update state of existing group member', async () => {
       await client.setEventMemberState(groupSecretParams, user1.authCredential!, new Uint8Array([1, 2, 3, 4]));
       expect((await client.fetchEvent(groupSecretParams, user1.authCredential!)).getMembersList().map(mem => mem.getState_asU8()).some(
           arr => typedArraysEqual(arr, new Uint8Array([1, 2, 3, 4]))
       ));
    });

    after(() => grpcServer.forceShutdown());
});
