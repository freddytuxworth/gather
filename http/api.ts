import GatherServer from "@gather/core/src/server";
import {GatherResponse, GatherStorage} from "@gather/core/src/types";
import {EncodedFrontend, GatherFrontend, InMemoryStorage} from "../core/test/testing_implementations";
import {Request, Response} from "express";

export class GatherApi {

    private readonly storage: GatherStorage;
    private readonly server: GatherServer;
    private readonly frontend: EncodedFrontend;

    constructor() {
        this.storage = new InMemoryStorage();
        this.server = new GatherServer(this.storage);
        this.frontend = new EncodedFrontend(this.server);
    }

    handleApiRequest(req: Request, res: Response) {
        this.frontend.handleRequest(req.body).then(response => response.);
    }
}