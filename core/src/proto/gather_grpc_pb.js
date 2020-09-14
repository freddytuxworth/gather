// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var gather_pb = require('./gather_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_gather_GAddEventMemberRequest(arg) {
  if (!(arg instanceof gather_pb.GAddEventMemberRequest)) {
    throw new Error('Expected argument of type gather.GAddEventMemberRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gather_GAddEventMemberRequest(buffer_arg) {
  return gather_pb.GAddEventMemberRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gather_GAuthCredentialRequest(arg) {
  if (!(arg instanceof gather_pb.GAuthCredentialRequest)) {
    throw new Error('Expected argument of type gather.GAuthCredentialRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gather_GAuthCredentialRequest(buffer_arg) {
  return gather_pb.GAuthCredentialRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gather_GAuthCredentialResponse(arg) {
  if (!(arg instanceof gather_pb.GAuthCredentialResponse)) {
    throw new Error('Expected argument of type gather.GAuthCredentialResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gather_GAuthCredentialResponse(buffer_arg) {
  return gather_pb.GAuthCredentialResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gather_GCreateEventRequest(arg) {
  if (!(arg instanceof gather_pb.GCreateEventRequest)) {
    throw new Error('Expected argument of type gather.GCreateEventRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gather_GCreateEventRequest(buffer_arg) {
  return gather_pb.GCreateEventRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gather_GEventRecord(arg) {
  if (!(arg instanceof gather_pb.GEventRecord)) {
    throw new Error('Expected argument of type gather.GEventRecord');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gather_GEventRecord(buffer_arg) {
  return gather_pb.GEventRecord.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gather_GFetchEventRequest(arg) {
  if (!(arg instanceof gather_pb.GFetchEventRequest)) {
    throw new Error('Expected argument of type gather.GFetchEventRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gather_GFetchEventRequest(buffer_arg) {
  return gather_pb.GFetchEventRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gather_GProfileKeyCredentialRequest(arg) {
  if (!(arg instanceof gather_pb.GProfileKeyCredentialRequest)) {
    throw new Error('Expected argument of type gather.GProfileKeyCredentialRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gather_GProfileKeyCredentialRequest(buffer_arg) {
  return gather_pb.GProfileKeyCredentialRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gather_GProfileKeyCredentialResponse(arg) {
  if (!(arg instanceof gather_pb.GProfileKeyCredentialResponse)) {
    throw new Error('Expected argument of type gather.GProfileKeyCredentialResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gather_GProfileKeyCredentialResponse(buffer_arg) {
  return gather_pb.GProfileKeyCredentialResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gather_GServerInfo(arg) {
  if (!(arg instanceof gather_pb.GServerInfo)) {
    throw new Error('Expected argument of type gather.GServerInfo');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gather_GServerInfo(buffer_arg) {
  return gather_pb.GServerInfo.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gather_GSetEventMemberStateRequest(arg) {
  if (!(arg instanceof gather_pb.GSetEventMemberStateRequest)) {
    throw new Error('Expected argument of type gather.GSetEventMemberStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gather_GSetEventMemberStateRequest(buffer_arg) {
  return gather_pb.GSetEventMemberStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gather_GUserRecord(arg) {
  if (!(arg instanceof gather_pb.GUserRecord)) {
    throw new Error('Expected argument of type gather.GUserRecord');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gather_GUserRecord(buffer_arg) {
  return gather_pb.GUserRecord.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}


var GatherServiceService = exports.GatherServiceService = {
  createUser: {
    path: '/gather.GatherService/CreateUser',
    requestStream: false,
    responseStream: false,
    requestType: gather_pb.GUserRecord,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_gather_GUserRecord,
    requestDeserialize: deserialize_gather_GUserRecord,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  getServerInfo: {
    path: '/gather.GatherService/GetServerInfo',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: gather_pb.GServerInfo,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_gather_GServerInfo,
    responseDeserialize: deserialize_gather_GServerInfo,
  },
  getAuthCredential: {
    path: '/gather.GatherService/GetAuthCredential',
    requestStream: false,
    responseStream: false,
    requestType: gather_pb.GAuthCredentialRequest,
    responseType: gather_pb.GAuthCredentialResponse,
    requestSerialize: serialize_gather_GAuthCredentialRequest,
    requestDeserialize: deserialize_gather_GAuthCredentialRequest,
    responseSerialize: serialize_gather_GAuthCredentialResponse,
    responseDeserialize: deserialize_gather_GAuthCredentialResponse,
  },
  getProfileKeyCredential: {
    path: '/gather.GatherService/GetProfileKeyCredential',
    requestStream: false,
    responseStream: false,
    requestType: gather_pb.GProfileKeyCredentialRequest,
    responseType: gather_pb.GProfileKeyCredentialResponse,
    requestSerialize: serialize_gather_GProfileKeyCredentialRequest,
    requestDeserialize: deserialize_gather_GProfileKeyCredentialRequest,
    responseSerialize: serialize_gather_GProfileKeyCredentialResponse,
    responseDeserialize: deserialize_gather_GProfileKeyCredentialResponse,
  },
  createEvent: {
    path: '/gather.GatherService/CreateEvent',
    requestStream: false,
    responseStream: false,
    requestType: gather_pb.GCreateEventRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_gather_GCreateEventRequest,
    requestDeserialize: deserialize_gather_GCreateEventRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  fetchEvent: {
    path: '/gather.GatherService/FetchEvent',
    requestStream: false,
    responseStream: false,
    requestType: gather_pb.GFetchEventRequest,
    responseType: gather_pb.GEventRecord,
    requestSerialize: serialize_gather_GFetchEventRequest,
    requestDeserialize: deserialize_gather_GFetchEventRequest,
    responseSerialize: serialize_gather_GEventRecord,
    responseDeserialize: deserialize_gather_GEventRecord,
  },
  addEventMember: {
    path: '/gather.GatherService/AddEventMember',
    requestStream: false,
    responseStream: false,
    requestType: gather_pb.GAddEventMemberRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_gather_GAddEventMemberRequest,
    requestDeserialize: deserialize_gather_GAddEventMemberRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  setEventMemberState: {
    path: '/gather.GatherService/SetEventMemberState',
    requestStream: false,
    responseStream: false,
    requestType: gather_pb.GSetEventMemberStateRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_gather_GSetEventMemberStateRequest,
    requestDeserialize: deserialize_gather_GSetEventMemberStateRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

exports.GatherServiceClient = grpc.makeGenericClientConstructor(GatherServiceService);
