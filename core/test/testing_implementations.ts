import {ServerSecretParams} from "zkgroup";
import {GatherStorage} from "../src/types";
import {typedArraysEqual} from "../src/util";
import {GEventRecord, GUserRecord} from "../src/proto/gather_pb";
//
// export function serializingLayer(transport: GatherFetcher): GatherFetcher {
//     return {
//         doRequest(request: IGatherRequest): Promise<IGatherResponseWrapper> {
//             const serialized = GatherRequest.encode(request).finish();
//             const deserialized = GatherRequest.decode(serialized);
//             return transport.doRequest(deserialized);
//         }
//     }
// }

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

    async addEvent(newEvent: GEventRecord) {
        this.events.push(newEvent);
    }

    async addUser(newUser: GUserRecord) {
        this.users.push(newUser);
    }

    async findEventByIdentifier(identifier: Uint8Array) {
        const event = this.events.find(
            event => typedArraysEqual(event.getGroupidentifier_asU8(), identifier));
        if (event === undefined)
            throw new Error("Event not found");
        return event;
    }

    async findUserByUuid(uuid: string) {
        const user = this.users.find(user => user.getUuid() === uuid);
        if (user === undefined)
            throw new Error("User not found");
        return user;
    }

    async saveSecretParams(secretParams: ServerSecretParams) {
        this.secretParams = secretParams;
    }

    async updateEvent(identifier: Uint8Array, newEvent: GEventRecord) {
        const index = this.events.findIndex(
            event => typedArraysEqual(event.getGroupidentifier_asU8(), identifier));
        if (index < 0)
            throw new Error("Event not found.");
        this.events[index] = newEvent;
    }

}
//
// export class EncodingFetcher implements Fetcher<IGatherRequest, IGatherResponseWrapper> {
//     private readonly wrapped: Fetcher<Uint8Array, Uint8Array>;
//
//     constructor(wrapping: Fetcher<Uint8Array, Uint8Array>) {
//         this.wrapped = wrapping;
//     }
//
//     async doRequest(request: IGatherRequest): Promise<IGatherResponseWrapper> {
//         const encodedRequest = GatherRequest.encode(request).finish();
//         const rawResponse = await this.wrapped.doRequest(encodedRequest);
//         if(GatherResponseWrapper.verify(rawResponse) !== null)
//             throw new Error("Response could not be parsed");
//
//         return GatherResponseWrapper.decode(rawResponse);
//     }
// }
//
//
// export class BinaryHttpTransport implements BinaryFetcher {
//     private readonly apiClient: AxiosInstance;
//     private readonly path: string;
//
//     constructor(baseUrl: string, path: string) {
//         this.path = path;
//         this.apiClient = axios.create({
//             baseURL: baseUrl,
//             responseType: 'arraybuffer',
//             headers: {'Content-Type': 'application/json'}
//         });
//     }
//
//     doRequest(request: Uint8Array): Promise<Uint8Array> {
//         return this.apiClient.post<Uint8Array>(this.path, request)
//             .then(response => response.data);
//     }
// }
//
// export const GatherHttpTransport = (baseUrl: string, path: string) =>
//     new EncodingFetcher(new BinaryHttpTransport(baseUrl, path));
