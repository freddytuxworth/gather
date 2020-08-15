import {GEventRecord, GUserRecord, IGEventRecord, IGUserRecord} from "./messages";
import {ServerSecretParams} from "zkgroup";
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
