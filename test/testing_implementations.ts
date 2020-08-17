import {ServerSecretParams} from "zkgroup";
import {
    GatherError,
    GatherRequest, GAuthCredentialResponse,
    GEventRecord, GOperationResult, GProfileKeyCredentialResponse, GServerInfo,
    GUserRecord,
    IGatherRequest,
    IGEventRecord,
    IGUserRecord
} from "../src/messages";
import {BinaryTransport, GatherResponse, GatherStorage, GGroupIdentifier} from "../src/types";
import {typedArraysEqual} from "../src/util";
import {GatherTransport} from "../src/types";
import GatherServer from "../src/server";
import axios, {AxiosInstance} from "axios";

export function serializingLayer(transport: GatherTransport): GatherTransport {
    return {
        doRequest: async <T extends GatherResponse>(request: IGatherRequest) => {
            const serialized = GatherRequest.encode(request).finish();
            const deserialized = GatherRequest.decode(serialized);
            return transport.doRequest(deserialized);
        }

    }
}

export function localTransport(server: GatherServer): GatherTransport {
    return {
        doRequest: async <T extends GatherResponse>(request: IGatherRequest) => {
            const response = await server.handleRequest(request);
            if (response instanceof GatherError)
                throw new Error(response.error);
            return response as T;
        }
    }
}

export class InMemoryStorage implements GatherStorage {

    private secretParams: ServerSecretParams;
    private users: Array<GUserRecord>;
    private events: Array<GEventRecord>;

    constructor(secretParams?: ServerSecretParams) {
        this.users = [];
        this.events = [];
        this.secretParams = secretParams !== undefined ? secretParams : ServerSecretParams.generate();
    }

    getSecretParams() {
        return this.secretParams;
    }

    async addEvent(newEvent: IGEventRecord | GEventRecord) {
        this.events.push(newEvent instanceof GEventRecord ? newEvent : new GEventRecord(newEvent));
    }

    async addUser(newUser: IGUserRecord | GUserRecord) {
        this.users.push(newUser instanceof GUserRecord ? newUser : new GUserRecord(newUser));
    }

    async findEventByIdentifier(identifier: GGroupIdentifier) {
        const event = this.events.find(
            event => typedArraysEqual(event.groupIdentifier, identifier));
        if (event === undefined)
            throw new Error("Event not found");
        return event;
    }

    async findUserByUuid(uuid: string) {
        const user = this.users.find(user => user.uuid === uuid);
        if (user === undefined)
            throw new Error("User not found");
        return user;
    }

    async saveSecretParams(secretParams: ServerSecretParams) {
        this.secretParams = secretParams;
    }

    async updateEvent(identifier: GGroupIdentifier, newEvent: IGEventRecord | GEventRecord) {
        const index = this.events.findIndex(
            event => typedArraysEqual(event.groupIdentifier, identifier));
        if (index < 0)
            throw new Error("Event not found.");
        this.events[index] = newEvent instanceof GEventRecord ? newEvent : new GEventRecord(newEvent);
    }

}

export class EncodedTransport implements GatherTransport {
    private readonly binaryTransport: BinaryTransport;

    constructor(binaryTransport: BinaryTransport) {
        this.binaryTransport = binaryTransport;
    }

    private static decodeResponseForRequest(request: IGatherRequest, response: Uint8Array): GatherResponse {
        if (request.getPublicParamsRequest)
            return GServerInfo.decode(response);
        if (request.createUserRequest)
            return GOperationResult.decode(response);
        if (request.authCredentialRequest)
            return GAuthCredentialResponse.decode(response);
        if (request.profileKeyCredentialRequest)
            return GProfileKeyCredentialResponse.decode(response);
        if (request.createEventRequest)
            return GOperationResult.decode(response);
        if (request.fetchEventRequest)
            return GEventRecord.decode(response);
        if (request.addEventMemberRequest)
            return GOperationResult.decode(response);
        if (request.setEventMemberStateRequest)
            return GOperationResult.decode(response);
        throw new Error("Didn't know what response to expect.");
    }

    async doRequest<T extends GatherResponse>(request: IGatherRequest): Promise<T> {
        const encoded = GatherRequest.encode(request).finish();
        const rawResponse = await this.binaryTransport.doRequest(encoded);
        if (GatherError.verify(rawResponse))
            throw new Error(GatherError.decode(rawResponse).error);

        return EncodedTransport.decodeResponseForRequest(request, rawResponse) as T;
    }
}

export type GatherFrontend = {
    handleRequest: (...args: any) => Promise<GatherResponse | GatherError>;
}

export class EncodedFrontend implements GatherFrontend {
    private readonly server: GatherServer;

    constructor(server: GatherServer) {
        this.server = server;
    }

    async handleRequest(rawRequest: Uint8Array): Promise<GatherResponse | GatherError> {
        if(GatherRequest.verify(rawRequest)) {
            return this.server.handleRequest(GatherRequest.decode(rawRequest));
        }
        return new GatherError({ error: "Invalid request" });
    }

}

export class BinaryHttpTransport implements BinaryTransport {
    private readonly apiClient: AxiosInstance;
    private readonly path: string;

    constructor(baseUrl: string, path: string) {
        this.path = path;
        this.apiClient = axios.create({
            baseURL: baseUrl,
            responseType: 'arraybuffer',
            headers: {'Content-Type': 'application/json'}
        });
    }

    doRequest(request: Uint8Array): Promise<Uint8Array> {
        return this.apiClient.post<Uint8Array>(this.path, request)
            .then(response => response.data);
    }
}

export const GatherHttpTransport = (baseUrl: string, path: string) =>
    new EncodedTransport(new BinaryHttpTransport(baseUrl, path));
