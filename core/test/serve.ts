// import {Server, ServerCredentials} from "@grpc/grpc-js";
// import {GatherServiceService} from "../src/proto/gather_grpc_pb";
// import GatherServer, {GatherServerWrapper} from "../src/server";
// import {InMemoryStorage} from "./testing_implementations";
// import {ServerSecretParams} from "zkgroup";
//
// const server = new Server();
// const secretParams = ServerSecretParams.generate();
//
// const impl = new GatherServer(new InMemoryStorage(secretParams));
// const wrapped = new GatherServerWrapper(impl);
// // @ts-ignore
// server.addService(GatherServiceService, wrapped);
// server.bindAsync("localhost:3030", ServerCredentials.createInsecure(), () => server.start());
// console.log("other");