// package: gather
// file: gather.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class GServerInfo extends jspb.Message { 

    hasPublicparams(): boolean;
    clearPublicparams(): void;
    getPublicparams(): Uint8Array | string;
    getPublicparams_asU8(): Uint8Array;
    getPublicparams_asB64(): string;
    setPublicparams(value: Uint8Array | string): GServerInfo;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GServerInfo.AsObject;
    static toObject(includeInstance: boolean, msg: GServerInfo): GServerInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GServerInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GServerInfo;
    static deserializeBinaryFromReader(message: GServerInfo, reader: jspb.BinaryReader): GServerInfo;
}

export namespace GServerInfo {
    export type AsObject = {
        publicparams: Uint8Array | string,
    }
}

export class GProfileRecord extends jspb.Message { 

    hasContent(): boolean;
    clearContent(): void;
    getContent(): Uint8Array | string;
    getContent_asU8(): Uint8Array;
    getContent_asB64(): string;
    setContent(value: Uint8Array | string): GProfileRecord;


    hasProfilekeyversion(): boolean;
    clearProfilekeyversion(): void;
    getProfilekeyversion(): Uint8Array | string;
    getProfilekeyversion_asU8(): Uint8Array;
    getProfilekeyversion_asB64(): string;
    setProfilekeyversion(value: Uint8Array | string): GProfileRecord;


    hasProfilekeycommitment(): boolean;
    clearProfilekeycommitment(): void;
    getProfilekeycommitment(): Uint8Array | string;
    getProfilekeycommitment_asU8(): Uint8Array;
    getProfilekeycommitment_asB64(): string;
    setProfilekeycommitment(value: Uint8Array | string): GProfileRecord;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GProfileRecord.AsObject;
    static toObject(includeInstance: boolean, msg: GProfileRecord): GProfileRecord.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GProfileRecord, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GProfileRecord;
    static deserializeBinaryFromReader(message: GProfileRecord, reader: jspb.BinaryReader): GProfileRecord;
}

export namespace GProfileRecord {
    export type AsObject = {
        content: Uint8Array | string,
        profilekeyversion: Uint8Array | string,
        profilekeycommitment: Uint8Array | string,
    }
}

export class GUserRecord extends jspb.Message { 

    hasUuid(): boolean;
    clearUuid(): void;
    getUuid(): string | undefined;
    setUuid(value: string): GUserRecord;


    hasPasswordhash(): boolean;
    clearPasswordhash(): void;
    getPasswordhash(): Uint8Array | string;
    getPasswordhash_asU8(): Uint8Array;
    getPasswordhash_asB64(): string;
    setPasswordhash(value: Uint8Array | string): GUserRecord;


    hasProfile(): boolean;
    clearProfile(): void;
    getProfile(): GProfileRecord;
    setProfile(value?: GProfileRecord): GUserRecord;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GUserRecord.AsObject;
    static toObject(includeInstance: boolean, msg: GUserRecord): GUserRecord.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GUserRecord, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GUserRecord;
    static deserializeBinaryFromReader(message: GUserRecord, reader: jspb.BinaryReader): GUserRecord;
}

export namespace GUserRecord {
    export type AsObject = {
        uuid?: string,
        passwordhash: Uint8Array | string,
        profile: GProfileRecord.AsObject,
    }
}

export class GAuthCredentialRequest extends jspb.Message { 

    hasUuid(): boolean;
    clearUuid(): void;
    getUuid(): string | undefined;
    setUuid(value: string): GAuthCredentialRequest;


    hasPasswordhash(): boolean;
    clearPasswordhash(): void;
    getPasswordhash(): Uint8Array | string;
    getPasswordhash_asU8(): Uint8Array;
    getPasswordhash_asB64(): string;
    setPasswordhash(value: Uint8Array | string): GAuthCredentialRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GAuthCredentialRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GAuthCredentialRequest): GAuthCredentialRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GAuthCredentialRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GAuthCredentialRequest;
    static deserializeBinaryFromReader(message: GAuthCredentialRequest, reader: jspb.BinaryReader): GAuthCredentialRequest;
}

export namespace GAuthCredentialRequest {
    export type AsObject = {
        uuid?: string,
        passwordhash: Uint8Array | string,
    }
}

export class GAuthCredentialResponse extends jspb.Message { 

    hasAuthcredentialresponse(): boolean;
    clearAuthcredentialresponse(): void;
    getAuthcredentialresponse(): Uint8Array | string;
    getAuthcredentialresponse_asU8(): Uint8Array;
    getAuthcredentialresponse_asB64(): string;
    setAuthcredentialresponse(value: Uint8Array | string): GAuthCredentialResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GAuthCredentialResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GAuthCredentialResponse): GAuthCredentialResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GAuthCredentialResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GAuthCredentialResponse;
    static deserializeBinaryFromReader(message: GAuthCredentialResponse, reader: jspb.BinaryReader): GAuthCredentialResponse;
}

export namespace GAuthCredentialResponse {
    export type AsObject = {
        authcredentialresponse: Uint8Array | string,
    }
}

export class GProfileKeyCredentialRequest extends jspb.Message { 

    hasUuid(): boolean;
    clearUuid(): void;
    getUuid(): string | undefined;
    setUuid(value: string): GProfileKeyCredentialRequest;


    hasProfilekeyversion(): boolean;
    clearProfilekeyversion(): void;
    getProfilekeyversion(): Uint8Array | string;
    getProfilekeyversion_asU8(): Uint8Array;
    getProfilekeyversion_asB64(): string;
    setProfilekeyversion(value: Uint8Array | string): GProfileKeyCredentialRequest;


    hasProfilekeycredentialrequest(): boolean;
    clearProfilekeycredentialrequest(): void;
    getProfilekeycredentialrequest(): Uint8Array | string;
    getProfilekeycredentialrequest_asU8(): Uint8Array;
    getProfilekeycredentialrequest_asB64(): string;
    setProfilekeycredentialrequest(value: Uint8Array | string): GProfileKeyCredentialRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GProfileKeyCredentialRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GProfileKeyCredentialRequest): GProfileKeyCredentialRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GProfileKeyCredentialRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GProfileKeyCredentialRequest;
    static deserializeBinaryFromReader(message: GProfileKeyCredentialRequest, reader: jspb.BinaryReader): GProfileKeyCredentialRequest;
}

export namespace GProfileKeyCredentialRequest {
    export type AsObject = {
        uuid?: string,
        profilekeyversion: Uint8Array | string,
        profilekeycredentialrequest: Uint8Array | string,
    }
}

export class GProfileKeyCredentialResponse extends jspb.Message { 

    hasProfilekeycredentialresponse(): boolean;
    clearProfilekeycredentialresponse(): void;
    getProfilekeycredentialresponse(): Uint8Array | string;
    getProfilekeycredentialresponse_asU8(): Uint8Array;
    getProfilekeycredentialresponse_asB64(): string;
    setProfilekeycredentialresponse(value: Uint8Array | string): GProfileKeyCredentialResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GProfileKeyCredentialResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GProfileKeyCredentialResponse): GProfileKeyCredentialResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GProfileKeyCredentialResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GProfileKeyCredentialResponse;
    static deserializeBinaryFromReader(message: GProfileKeyCredentialResponse, reader: jspb.BinaryReader): GProfileKeyCredentialResponse;
}

export namespace GProfileKeyCredentialResponse {
    export type AsObject = {
        profilekeycredentialresponse: Uint8Array | string,
    }
}

export class GEventMemberRecord extends jspb.Message { 

    hasProfilekeycredentialpresentation(): boolean;
    clearProfilekeycredentialpresentation(): void;
    getProfilekeycredentialpresentation(): Uint8Array | string;
    getProfilekeycredentialpresentation_asU8(): Uint8Array;
    getProfilekeycredentialpresentation_asB64(): string;
    setProfilekeycredentialpresentation(value: Uint8Array | string): GEventMemberRecord;


    hasRole(): boolean;
    clearRole(): void;
    getRole(): GEventMemberRole | undefined;
    setRole(value: GEventMemberRole): GEventMemberRecord;


    hasState(): boolean;
    clearState(): void;
    getState(): Uint8Array | string;
    getState_asU8(): Uint8Array;
    getState_asB64(): string;
    setState(value: Uint8Array | string): GEventMemberRecord;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GEventMemberRecord.AsObject;
    static toObject(includeInstance: boolean, msg: GEventMemberRecord): GEventMemberRecord.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GEventMemberRecord, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GEventMemberRecord;
    static deserializeBinaryFromReader(message: GEventMemberRecord, reader: jspb.BinaryReader): GEventMemberRecord;
}

export namespace GEventMemberRecord {
    export type AsObject = {
        profilekeycredentialpresentation: Uint8Array | string,
        role?: GEventMemberRole,
        state: Uint8Array | string,
    }
}

export class GCreateEventRequest extends jspb.Message { 

    hasGrouppublicparams(): boolean;
    clearGrouppublicparams(): void;
    getGrouppublicparams(): Uint8Array | string;
    getGrouppublicparams_asU8(): Uint8Array;
    getGrouppublicparams_asB64(): string;
    setGrouppublicparams(value: Uint8Array | string): GCreateEventRequest;


    hasContent(): boolean;
    clearContent(): void;
    getContent(): Uint8Array | string;
    getContent_asU8(): Uint8Array;
    getContent_asB64(): string;
    setContent(value: Uint8Array | string): GCreateEventRequest;


    hasAuthcredentialpresentation(): boolean;
    clearAuthcredentialpresentation(): void;
    getAuthcredentialpresentation(): Uint8Array | string;
    getAuthcredentialpresentation_asU8(): Uint8Array;
    getAuthcredentialpresentation_asB64(): string;
    setAuthcredentialpresentation(value: Uint8Array | string): GCreateEventRequest;

    clearInitialmembersList(): void;
    getInitialmembersList(): Array<GEventMemberRecord>;
    setInitialmembersList(value: Array<GEventMemberRecord>): GCreateEventRequest;
    addInitialmembers(value?: GEventMemberRecord, index?: number): GEventMemberRecord;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GCreateEventRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GCreateEventRequest): GCreateEventRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GCreateEventRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GCreateEventRequest;
    static deserializeBinaryFromReader(message: GCreateEventRequest, reader: jspb.BinaryReader): GCreateEventRequest;
}

export namespace GCreateEventRequest {
    export type AsObject = {
        grouppublicparams: Uint8Array | string,
        content: Uint8Array | string,
        authcredentialpresentation: Uint8Array | string,
        initialmembersList: Array<GEventMemberRecord.AsObject>,
    }
}

export class GFetchEventRequest extends jspb.Message { 

    hasGroupidentifier(): boolean;
    clearGroupidentifier(): void;
    getGroupidentifier(): Uint8Array | string;
    getGroupidentifier_asU8(): Uint8Array;
    getGroupidentifier_asB64(): string;
    setGroupidentifier(value: Uint8Array | string): GFetchEventRequest;


    hasAuthcredentialpresentation(): boolean;
    clearAuthcredentialpresentation(): void;
    getAuthcredentialpresentation(): Uint8Array | string;
    getAuthcredentialpresentation_asU8(): Uint8Array;
    getAuthcredentialpresentation_asB64(): string;
    setAuthcredentialpresentation(value: Uint8Array | string): GFetchEventRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GFetchEventRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GFetchEventRequest): GFetchEventRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GFetchEventRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GFetchEventRequest;
    static deserializeBinaryFromReader(message: GFetchEventRequest, reader: jspb.BinaryReader): GFetchEventRequest;
}

export namespace GFetchEventRequest {
    export type AsObject = {
        groupidentifier: Uint8Array | string,
        authcredentialpresentation: Uint8Array | string,
    }
}

export class GEventRecord extends jspb.Message { 

    hasGroupidentifier(): boolean;
    clearGroupidentifier(): void;
    getGroupidentifier(): Uint8Array | string;
    getGroupidentifier_asU8(): Uint8Array;
    getGroupidentifier_asB64(): string;
    setGroupidentifier(value: Uint8Array | string): GEventRecord;


    hasGrouppublicparams(): boolean;
    clearGrouppublicparams(): void;
    getGrouppublicparams(): Uint8Array | string;
    getGrouppublicparams_asU8(): Uint8Array;
    getGrouppublicparams_asB64(): string;
    setGrouppublicparams(value: Uint8Array | string): GEventRecord;


    hasContent(): boolean;
    clearContent(): void;
    getContent(): Uint8Array | string;
    getContent_asU8(): Uint8Array;
    getContent_asB64(): string;
    setContent(value: Uint8Array | string): GEventRecord;

    clearMembersList(): void;
    getMembersList(): Array<GEventMemberRecord>;
    setMembersList(value: Array<GEventMemberRecord>): GEventRecord;
    addMembers(value?: GEventMemberRecord, index?: number): GEventMemberRecord;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GEventRecord.AsObject;
    static toObject(includeInstance: boolean, msg: GEventRecord): GEventRecord.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GEventRecord, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GEventRecord;
    static deserializeBinaryFromReader(message: GEventRecord, reader: jspb.BinaryReader): GEventRecord;
}

export namespace GEventRecord {
    export type AsObject = {
        groupidentifier: Uint8Array | string,
        grouppublicparams: Uint8Array | string,
        content: Uint8Array | string,
        membersList: Array<GEventMemberRecord.AsObject>,
    }
}

export class GAddEventMemberRequest extends jspb.Message { 

    hasGroupidentifier(): boolean;
    clearGroupidentifier(): void;
    getGroupidentifier(): Uint8Array | string;
    getGroupidentifier_asU8(): Uint8Array;
    getGroupidentifier_asB64(): string;
    setGroupidentifier(value: Uint8Array | string): GAddEventMemberRequest;


    hasAuthcredentialpresentation(): boolean;
    clearAuthcredentialpresentation(): void;
    getAuthcredentialpresentation(): Uint8Array | string;
    getAuthcredentialpresentation_asU8(): Uint8Array;
    getAuthcredentialpresentation_asB64(): string;
    setAuthcredentialpresentation(value: Uint8Array | string): GAddEventMemberRequest;


    hasNewmemberprofilekeycredentialpresentation(): boolean;
    clearNewmemberprofilekeycredentialpresentation(): void;
    getNewmemberprofilekeycredentialpresentation(): Uint8Array | string;
    getNewmemberprofilekeycredentialpresentation_asU8(): Uint8Array;
    getNewmemberprofilekeycredentialpresentation_asB64(): string;
    setNewmemberprofilekeycredentialpresentation(value: Uint8Array | string): GAddEventMemberRequest;


    hasNewmemberrole(): boolean;
    clearNewmemberrole(): void;
    getNewmemberrole(): GEventMemberRole | undefined;
    setNewmemberrole(value: GEventMemberRole): GAddEventMemberRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GAddEventMemberRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GAddEventMemberRequest): GAddEventMemberRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GAddEventMemberRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GAddEventMemberRequest;
    static deserializeBinaryFromReader(message: GAddEventMemberRequest, reader: jspb.BinaryReader): GAddEventMemberRequest;
}

export namespace GAddEventMemberRequest {
    export type AsObject = {
        groupidentifier: Uint8Array | string,
        authcredentialpresentation: Uint8Array | string,
        newmemberprofilekeycredentialpresentation: Uint8Array | string,
        newmemberrole?: GEventMemberRole,
    }
}

export class GSetEventMemberStateRequest extends jspb.Message { 

    hasGroupidentifier(): boolean;
    clearGroupidentifier(): void;
    getGroupidentifier(): Uint8Array | string;
    getGroupidentifier_asU8(): Uint8Array;
    getGroupidentifier_asB64(): string;
    setGroupidentifier(value: Uint8Array | string): GSetEventMemberStateRequest;


    hasAuthcredentialpresentation(): boolean;
    clearAuthcredentialpresentation(): void;
    getAuthcredentialpresentation(): Uint8Array | string;
    getAuthcredentialpresentation_asU8(): Uint8Array;
    getAuthcredentialpresentation_asB64(): string;
    setAuthcredentialpresentation(value: Uint8Array | string): GSetEventMemberStateRequest;


    hasNewstate(): boolean;
    clearNewstate(): void;
    getNewstate(): Uint8Array | string;
    getNewstate_asU8(): Uint8Array;
    getNewstate_asB64(): string;
    setNewstate(value: Uint8Array | string): GSetEventMemberStateRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GSetEventMemberStateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GSetEventMemberStateRequest): GSetEventMemberStateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GSetEventMemberStateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GSetEventMemberStateRequest;
    static deserializeBinaryFromReader(message: GSetEventMemberStateRequest, reader: jspb.BinaryReader): GSetEventMemberStateRequest;
}

export namespace GSetEventMemberStateRequest {
    export type AsObject = {
        groupidentifier: Uint8Array | string,
        authcredentialpresentation: Uint8Array | string,
        newstate: Uint8Array | string,
    }
}

export enum GEventMemberAttendance {
    UNKNOWN = 0,
    GOING = 1,
    NOT_GOING = 2,
}

export enum GEventMemberRole {
    CREATOR = 0,
    ADMIN = 1,
    DEFAULT = 2,
}
