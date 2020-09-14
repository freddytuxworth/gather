import GatherServer from "@gather/core/src/server";
import {GatherStorage} from "@gather/core/src/types";
import {InMemoryStorage} from "@gather/core/test/testing_implementations";
import {Request, Response} from "express";
import {EncodingFrontend, PackingFrontend} from "@gather/core/src/transport";
import {LOG} from "./server";

export class GatherApi {

    private readonly storage: GatherStorage;
    private readonly server: GatherServer;
    private readonly frontend: EncodingFrontend;

    constructor() {
        this.storage = new InMemoryStorage();
        this.server = new GatherServer(this.storage);
        this.frontend = new EncodingFrontend(new PackingFrontend(this.server));
        LOG.debug("Finished initialising GatherApi instance");
    }

    handleApiRequest(req: Request, res: Response) {
        this.frontend.handleRequest(req.body).then(response => res.send(response));
    }
}