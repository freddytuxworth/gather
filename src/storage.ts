import {GEventRecord, GUserRecord, IGEventRecord, IGUserRecord, IZkGroupIdentifier} from "./messages";
import {GroupIdentifier, ServerSecretParams} from "zkgroup";
import {maybeDeconstruct, typedArraysEqual} from "./util";

/**
 * Interface providing persistent storage for Gather service data.
 */
export type GatherStorage = {

    saveSecretParams: (secretParams: ServerSecretParams) => Promise<void>,
    getSecretParams: () => ServerSecretParams,
    findUserByUuid: (uuid: string) => Promise<GUserRecord>,
    addUser: (newUser: IGUserRecord | GUserRecord) => Promise<void>,
    findEventByIdentifier: (identifier: GroupIdentifier | IZkGroupIdentifier) => Promise<GEventRecord>,
    addEvent: (newEvent: IGEventRecord | GEventRecord) => Promise<void>
    updateEvent: (identifier: GroupIdentifier | IZkGroupIdentifier,
                  newEvent: IGEventRecord | GEventRecord) => Promise<void>
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

    async findEventByIdentifier(identifier: GroupIdentifier | IZkGroupIdentifier) {
        const groupIdentifierContent = maybeDeconstruct(identifier);
        const event = this.events.find(
            event => typedArraysEqual(event.groupIdentifier.content, groupIdentifierContent));
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

    async updateEvent(identifier: GroupIdentifier | IZkGroupIdentifier, newEvent: IGEventRecord | GEventRecord) {
        const groupIdentifierContent = maybeDeconstruct(identifier);
        const index = this.events.findIndex(
            event => typedArraysEqual(event.groupIdentifier.content, groupIdentifierContent));
        if (index < 0)
            throw new Error("Event not found.");
        this.events[index] = newEvent instanceof GEventRecord ? newEvent : new GEventRecord(newEvent);
    }

}