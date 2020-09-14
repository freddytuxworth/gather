import {ServerSecretParams} from "zkgroup";
import {GEventRecord, GUserRecord} from "./proto/gather_pb";
import {IGatherServiceClient, IGatherServiceServer, IGatherServiceService} from "./proto/gather_grpc_pb";
import {handleUnaryCall} from "@grpc/grpc-js";
import * as grpc from "@grpc/grpc-js";
import * as gather_pb from "./proto/gather_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export type AsyncGatherService = {
    [P in keyof IGatherServiceServer]: IGatherServiceServer[P] extends handleUnaryCall<infer Req, infer Res> ? (request: Req) => Promise<Res> : never;
}

export type GatherStorage = {
    saveSecretParams: (secretParams: ServerSecretParams) => Promise<void>,
    getSecretParams: () => ServerSecretParams,
    findUserByUuid: (uuid: string) => Promise<GUserRecord>,
    addUser: (newUser: GUserRecord) => Promise<void>,
    findEventByIdentifier: (identifier: Uint8Array) => Promise<GEventRecord>,
    addEvent: (newEvent: GEventRecord) => Promise<void>
    updateEvent: (identifier: Uint8Array,
                  newEvent: GEventRecord) => Promise<void>
}
