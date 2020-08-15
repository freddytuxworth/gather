import {ServerSecretParams} from "zkgroup";
import {
    GatherError,
    GatherRequest,
    GEventRecord,
    GUserRecord,
    IGatherRequest,
    IGEventRecord,
    IGUserRecord
} from "./messages";
import {GGroupIdentifier} from "./types";
import {typedArraysEqual} from "./util";
import {GatherStorage} from "./storage";
import GatherServer, {GatherResponse} from "./server";
import {GatherTransport} from "./rest";

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

// export class GatherHttpTransport implements GatherTransport {
//     private readonly apiClient: AxiosInstance;
//
//     constructor(baseUrl: string) {
//         this.apiClient = axios.create({
//             baseURL: baseUrl,
//             responseType: 'json',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//     }
//
//     private static decodeResponseForRequest(request: IGatherRequest, response: Uint8Array): GatherResponse {
//         const result =
//         if (request.getPublicParamsRequest)
//             return GServerInfo.decode(response);
//         if (request.createUserRequest)
//             return GOperationResult.decode(response);
//         if (request.authCredentialRequest)
//             return GAuthCredentialResponse.decode(response);
//         if (request.profileKeyCredentialRequest)
//             return GProfileKeyCredentialResponse.decode(response);
//         if (request.createEventRequest)
//             return GOperationResult.decode(response);
//         if (request.fetchEventRequest)
//             return GEventRecord.decode(response);
//         if (request.addEventMemberRequest)
//             return GOperationResult.decode(response);
//         if (request.setEventMemberStateRequest)
//             return GOperationResult.decode(response);
//         throw new Error("Didn't know what response to expect.");
//     }
//
//     doRequest<T extends GatherResponse>(request: IGatherRequest): Promise<T> {
//         const encoded = GatherRequest.encode(request).finish();
//         return this.apiClient.post<Uint8Array>("/api", encoded, {responseType: "arraybuffer"})
//             .then(response => response.data)
//             .then(data => GatherHttpTransport.decodeResponseForRequest(request, data) as unknown as T);
//     }
// }
