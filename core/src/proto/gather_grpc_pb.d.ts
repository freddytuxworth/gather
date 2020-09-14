// package: gather
// file: gather.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as gather_pb from "./gather_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IGatherServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createUser: IGatherServiceService_ICreateUser;
    getServerInfo: IGatherServiceService_IGetServerInfo;
    getAuthCredential: IGatherServiceService_IGetAuthCredential;
    getProfileKeyCredential: IGatherServiceService_IGetProfileKeyCredential;
    createEvent: IGatherServiceService_ICreateEvent;
    fetchEvent: IGatherServiceService_IFetchEvent;
    addEventMember: IGatherServiceService_IAddEventMember;
    setEventMemberState: IGatherServiceService_ISetEventMemberState;
}

interface IGatherServiceService_ICreateUser extends grpc.MethodDefinition<gather_pb.GUserRecord, google_protobuf_empty_pb.Empty> {
    path: string; // "/gather.GatherService/CreateUser"
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gather_pb.GUserRecord>;
    requestDeserialize: grpc.deserialize<gather_pb.GUserRecord>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IGatherServiceService_IGetServerInfo extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, gather_pb.GServerInfo> {
    path: string; // "/gather.GatherService/GetServerInfo"
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<gather_pb.GServerInfo>;
    responseDeserialize: grpc.deserialize<gather_pb.GServerInfo>;
}
interface IGatherServiceService_IGetAuthCredential extends grpc.MethodDefinition<gather_pb.GAuthCredentialRequest, gather_pb.GAuthCredentialResponse> {
    path: string; // "/gather.GatherService/GetAuthCredential"
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gather_pb.GAuthCredentialRequest>;
    requestDeserialize: grpc.deserialize<gather_pb.GAuthCredentialRequest>;
    responseSerialize: grpc.serialize<gather_pb.GAuthCredentialResponse>;
    responseDeserialize: grpc.deserialize<gather_pb.GAuthCredentialResponse>;
}
interface IGatherServiceService_IGetProfileKeyCredential extends grpc.MethodDefinition<gather_pb.GProfileKeyCredentialRequest, gather_pb.GProfileKeyCredentialResponse> {
    path: string; // "/gather.GatherService/GetProfileKeyCredential"
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gather_pb.GProfileKeyCredentialRequest>;
    requestDeserialize: grpc.deserialize<gather_pb.GProfileKeyCredentialRequest>;
    responseSerialize: grpc.serialize<gather_pb.GProfileKeyCredentialResponse>;
    responseDeserialize: grpc.deserialize<gather_pb.GProfileKeyCredentialResponse>;
}
interface IGatherServiceService_ICreateEvent extends grpc.MethodDefinition<gather_pb.GCreateEventRequest, google_protobuf_empty_pb.Empty> {
    path: string; // "/gather.GatherService/CreateEvent"
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gather_pb.GCreateEventRequest>;
    requestDeserialize: grpc.deserialize<gather_pb.GCreateEventRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IGatherServiceService_IFetchEvent extends grpc.MethodDefinition<gather_pb.GFetchEventRequest, gather_pb.GEventRecord> {
    path: string; // "/gather.GatherService/FetchEvent"
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gather_pb.GFetchEventRequest>;
    requestDeserialize: grpc.deserialize<gather_pb.GFetchEventRequest>;
    responseSerialize: grpc.serialize<gather_pb.GEventRecord>;
    responseDeserialize: grpc.deserialize<gather_pb.GEventRecord>;
}
interface IGatherServiceService_IAddEventMember extends grpc.MethodDefinition<gather_pb.GAddEventMemberRequest, google_protobuf_empty_pb.Empty> {
    path: string; // "/gather.GatherService/AddEventMember"
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gather_pb.GAddEventMemberRequest>;
    requestDeserialize: grpc.deserialize<gather_pb.GAddEventMemberRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IGatherServiceService_ISetEventMemberState extends grpc.MethodDefinition<gather_pb.GSetEventMemberStateRequest, google_protobuf_empty_pb.Empty> {
    path: string; // "/gather.GatherService/SetEventMemberState"
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gather_pb.GSetEventMemberStateRequest>;
    requestDeserialize: grpc.deserialize<gather_pb.GSetEventMemberStateRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const GatherServiceService: IGatherServiceService;

export interface IGatherServiceServer {
    createUser: grpc.handleUnaryCall<gather_pb.GUserRecord, google_protobuf_empty_pb.Empty>;
    getServerInfo: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, gather_pb.GServerInfo>;
    getAuthCredential: grpc.handleUnaryCall<gather_pb.GAuthCredentialRequest, gather_pb.GAuthCredentialResponse>;
    getProfileKeyCredential: grpc.handleUnaryCall<gather_pb.GProfileKeyCredentialRequest, gather_pb.GProfileKeyCredentialResponse>;
    createEvent: grpc.handleUnaryCall<gather_pb.GCreateEventRequest, google_protobuf_empty_pb.Empty>;
    fetchEvent: grpc.handleUnaryCall<gather_pb.GFetchEventRequest, gather_pb.GEventRecord>;
    addEventMember: grpc.handleUnaryCall<gather_pb.GAddEventMemberRequest, google_protobuf_empty_pb.Empty>;
    setEventMemberState: grpc.handleUnaryCall<gather_pb.GSetEventMemberStateRequest, google_protobuf_empty_pb.Empty>;
}

export interface IGatherServiceClient {
    createUser(request: gather_pb.GUserRecord, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    createUser(request: gather_pb.GUserRecord, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    createUser(request: gather_pb.GUserRecord, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    getServerInfo(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: gather_pb.GServerInfo) => void): grpc.ClientUnaryCall;
    getServerInfo(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gather_pb.GServerInfo) => void): grpc.ClientUnaryCall;
    getServerInfo(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gather_pb.GServerInfo) => void): grpc.ClientUnaryCall;
    getAuthCredential(request: gather_pb.GAuthCredentialRequest, callback: (error: grpc.ServiceError | null, response: gather_pb.GAuthCredentialResponse) => void): grpc.ClientUnaryCall;
    getAuthCredential(request: gather_pb.GAuthCredentialRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gather_pb.GAuthCredentialResponse) => void): grpc.ClientUnaryCall;
    getAuthCredential(request: gather_pb.GAuthCredentialRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gather_pb.GAuthCredentialResponse) => void): grpc.ClientUnaryCall;
    getProfileKeyCredential(request: gather_pb.GProfileKeyCredentialRequest, callback: (error: grpc.ServiceError | null, response: gather_pb.GProfileKeyCredentialResponse) => void): grpc.ClientUnaryCall;
    getProfileKeyCredential(request: gather_pb.GProfileKeyCredentialRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gather_pb.GProfileKeyCredentialResponse) => void): grpc.ClientUnaryCall;
    getProfileKeyCredential(request: gather_pb.GProfileKeyCredentialRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gather_pb.GProfileKeyCredentialResponse) => void): grpc.ClientUnaryCall;
    createEvent(request: gather_pb.GCreateEventRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    createEvent(request: gather_pb.GCreateEventRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    createEvent(request: gather_pb.GCreateEventRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    fetchEvent(request: gather_pb.GFetchEventRequest, callback: (error: grpc.ServiceError | null, response: gather_pb.GEventRecord) => void): grpc.ClientUnaryCall;
    fetchEvent(request: gather_pb.GFetchEventRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gather_pb.GEventRecord) => void): grpc.ClientUnaryCall;
    fetchEvent(request: gather_pb.GFetchEventRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gather_pb.GEventRecord) => void): grpc.ClientUnaryCall;
    addEventMember(request: gather_pb.GAddEventMemberRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    addEventMember(request: gather_pb.GAddEventMemberRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    addEventMember(request: gather_pb.GAddEventMemberRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setEventMemberState(request: gather_pb.GSetEventMemberStateRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setEventMemberState(request: gather_pb.GSetEventMemberStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setEventMemberState(request: gather_pb.GSetEventMemberStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class GatherServiceClient extends grpc.Client implements IGatherServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public createUser(request: gather_pb.GUserRecord, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public createUser(request: gather_pb.GUserRecord, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public createUser(request: gather_pb.GUserRecord, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public getServerInfo(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: gather_pb.GServerInfo) => void): grpc.ClientUnaryCall;
    public getServerInfo(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gather_pb.GServerInfo) => void): grpc.ClientUnaryCall;
    public getServerInfo(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gather_pb.GServerInfo) => void): grpc.ClientUnaryCall;
    public getAuthCredential(request: gather_pb.GAuthCredentialRequest, callback: (error: grpc.ServiceError | null, response: gather_pb.GAuthCredentialResponse) => void): grpc.ClientUnaryCall;
    public getAuthCredential(request: gather_pb.GAuthCredentialRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gather_pb.GAuthCredentialResponse) => void): grpc.ClientUnaryCall;
    public getAuthCredential(request: gather_pb.GAuthCredentialRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gather_pb.GAuthCredentialResponse) => void): grpc.ClientUnaryCall;
    public getProfileKeyCredential(request: gather_pb.GProfileKeyCredentialRequest, callback: (error: grpc.ServiceError | null, response: gather_pb.GProfileKeyCredentialResponse) => void): grpc.ClientUnaryCall;
    public getProfileKeyCredential(request: gather_pb.GProfileKeyCredentialRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gather_pb.GProfileKeyCredentialResponse) => void): grpc.ClientUnaryCall;
    public getProfileKeyCredential(request: gather_pb.GProfileKeyCredentialRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gather_pb.GProfileKeyCredentialResponse) => void): grpc.ClientUnaryCall;
    public createEvent(request: gather_pb.GCreateEventRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public createEvent(request: gather_pb.GCreateEventRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public createEvent(request: gather_pb.GCreateEventRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public fetchEvent(request: gather_pb.GFetchEventRequest, callback: (error: grpc.ServiceError | null, response: gather_pb.GEventRecord) => void): grpc.ClientUnaryCall;
    public fetchEvent(request: gather_pb.GFetchEventRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gather_pb.GEventRecord) => void): grpc.ClientUnaryCall;
    public fetchEvent(request: gather_pb.GFetchEventRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gather_pb.GEventRecord) => void): grpc.ClientUnaryCall;
    public addEventMember(request: gather_pb.GAddEventMemberRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public addEventMember(request: gather_pb.GAddEventMemberRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public addEventMember(request: gather_pb.GAddEventMemberRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setEventMemberState(request: gather_pb.GSetEventMemberStateRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setEventMemberState(request: gather_pb.GSetEventMemberStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setEventMemberState(request: gather_pb.GSetEventMemberStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
