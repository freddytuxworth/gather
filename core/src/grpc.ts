import {GatherServiceClient, GatherServiceService, IGatherServiceServer} from "./proto/gather_grpc_pb";
import {
    ChannelCredentials,
    credentials,
    sendUnaryData,
    Server,
    ServerCredentials,
    ServerUnaryCall
} from "@grpc/grpc-js";
import GatherServer from "./server";
import {AsyncGatherService} from "./types";
import {
    GAddEventMemberRequest,
    GAuthCredentialRequest,
    GAuthCredentialResponse,
    GCreateEventRequest,
    GEventRecord,
    GFetchEventRequest,
    GProfileKeyCredentialRequest,
    GProfileKeyCredentialResponse,
    GServerInfo,
    GSetEventMemberStateRequest,
    GUserRecord
} from "./proto/gather_pb";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";

class GatherGrpcServerWrapper implements IGatherServiceServer {

    constructor(private readonly server: GatherServer) {
    };

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

export function createGatherGrpcServer(server: GatherServer, address: string): Promise<Server> {
    const grpcServer = new Server();
    // @ts-ignore
    grpcServer.addService(GatherServiceService, new GatherGrpcServerWrapper(server));
    return new Promise((resolve, reject) =>
        grpcServer.bindAsync(address, ServerCredentials.createInsecure(),
            (error, port) => error ? reject(error) : resolve(grpcServer)));
}

class GatherGrpcClientWrapper implements AsyncGatherService {

    constructor(private readonly client: GatherServiceClient) {};

    addEventMember = (request: GAddEventMemberRequest) => new Promise<Empty>((resolve, reject) =>
        this.client.addEventMember(request, (err, res) => err ? reject(err) : resolve(res)));

    createEvent = (request: GCreateEventRequest) => new Promise<Empty>((resolve, reject) =>
        this.client.createEvent(request, (err, res) => err ? reject(err) : resolve(res)));

    createUser = (request: GUserRecord) => new Promise<Empty>((resolve, reject) =>
        this.client.createUser(request, (err, res) => err ? reject(err) : resolve(res)));

    fetchEvent = (request: GFetchEventRequest) => new Promise<GEventRecord>((resolve, reject) =>
        this.client.fetchEvent(request, (err, res) => err ? reject(err) : resolve(res)));

    getAuthCredential = (request: GAuthCredentialRequest) => new Promise<GAuthCredentialResponse>(
        (resolve, reject) =>
            this.client.getAuthCredential(request, (err, res) => err ? reject(err) : resolve(res)));

    getProfileKeyCredential = (request: GProfileKeyCredentialRequest) => new Promise<GProfileKeyCredentialResponse>(
        (resolve, reject) =>
            this.client.getProfileKeyCredential(request, (err, res) => err ? reject(err) : resolve(res)));

    getServerInfo = (request: Empty) => new Promise<GServerInfo>((resolve, reject) =>
        this.client.getServerInfo(request, (err, res) => err ? reject(err) : resolve(res)));

    setEventMemberState = (request: GSetEventMemberStateRequest) => new Promise<Empty>((resolve, reject) =>
        this.client.setEventMemberState(request, (err, res) => err ? reject(err) : resolve(res)));

}

export function createGatherGrpcConnection(address: string): AsyncGatherService {
    const grpcClient = new GatherServiceClient(address, credentials.createInsecure());
    return new GatherGrpcClientWrapper(grpcClient);
}
