import {GEventRecord, GUserRecord, IGEventRecord, IGUserRecord} from "./messages";
import {GroupIdentifier, ServerSecretParams} from "zkgroup";
import {maybeDeconstruct, typedArraysEqual} from "./util";
import {GGroupIdentifier} from "./types";

/**
 * Interface providing persistent storage for Gather service data.
 */
export type GatherStorage = {

    saveSecretParams: (secretParams: ServerSecretParams) => Promise<void>,
    getSecretParams: () => ServerSecretParams,
    findUserByUuid: (uuid: string) => Promise<GUserRecord>,
    addUser: (newUser: IGUserRecord | GUserRecord) => Promise<void>,
    findEventByIdentifier: (identifier: GGroupIdentifier) => Promise<GEventRecord>,
    addEvent: (newEvent: IGEventRecord | GEventRecord) => Promise<void>
    updateEvent: (identifier: GGroupIdentifier,
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