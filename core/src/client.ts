import {GatherServiceClient, IGatherServiceService} from "./proto/gather_grpc_pb";
import {GatherServerApi} from "./types";
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
export class GatherClient implements GatherServerApi {

    constructor(private readonly client: GatherServiceClient) {};

    addEventMember = (request: GAddEventMemberRequest) => new Promise<Empty>((resolve, reject) =>
        this.client.addEventMember(request, (err, res) => err ? reject(err) : resolve(res)));

    createEvent = (request: GCreateEventRequest) => new Promise<Empty>((resolve, reject) =>
        this.client.createEvent(request, (err, res) => err ? reject(err) : resolve(res)));

    createUser = (request: GUserRecord) => new Promise<Empty>((resolve, reject) =>
        this.client.createUser(request, (err, res) => err ? reject(err) : resolve(res)));

    fetchEvent = (request: GFetchEventRequest) => new Promise<GEventRecord>((resolve, reject) =>
        this.client.fetchEvent(request, (err, res) => err ? reject(err) : resolve(res)));

    getAuthCredential = (request: GAuthCredentialRequest) => new Promise<GAuthCredentialResponse>((resolve, reject) =>
        this.client.getAuthCredential(request, (err, res) => err ? reject(err) : resolve(res)));

    getProfileKeyCredential = (request: GProfileKeyCredentialRequest) => new Promise<GProfileKeyCredentialResponse>((resolve, reject) =>
        this.client.getProfileKeyCredential(request, (err, res) => err ? reject(err) : resolve(res)));

    getServerInfo = (request: Empty) => new Promise<GServerInfo>((resolve, reject) =>
        this.client.getServerInfo(request, (err, res) => err ? reject(err) : resolve(res)));

    setEventMemberState = (request: GSetEventMemberStateRequest) => new Promise<Empty>((resolve, reject) =>
        this.client.setEventMemberState(request, (err, res) => err ? reject(err) : resolve(res)));

}