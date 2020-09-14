// import {GatherServiceClient} from "../src/proto/gather_grpc_pb";
// import {credentials} from "@grpc/grpc-js";
// import {Empty} from "google-protobuf/google/protobuf/empty_pb";
// import {GProfileRecord, GUserRecord} from "../src/proto/gather_pb";
//
// const client = new GatherServiceClient("localhost:3030", credentials.createInsecure());
//
// // function doLog(err, res) {
// //     if(err != undefined)
// //         console.error(err);
// //     else
// //         console.log(res);
// // }
//
// client.getPublicParams(new Empty(), (err, res) => {
//     console.error(err);
//     console.log(res.getPublicparams_asB64());
// });
//
// const newUser = new GUserRecord();
// newUser.setUuid("mr bean");
// const newProfile = new GProfileRecord();
// newProfile.setContent("profile content");
// newProfile.setProfilekeycommitment(new Uint8Array(20));
// newProfile.setProfilekeyversion(new Uint8Array(20));
// newUser.setProfile(newProfile)
// client.createUser(newUser, (err, res) => {
//     console.error(err);
//     client.createUser(newUser, (err, res) => {
//         console.error(err);
//     })
// })
