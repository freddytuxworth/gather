import express from 'express';
import bodyParser from 'body-parser';
import {GatherApi} from "./api";
import {getLogger} from "log4js";

const SERVER_PORT = 8080;
export const LOG = getLogger();
LOG.level = process.env.GATHER_LOGGING == "debug" ? "debug" : "off";

const app = express();
LOG.debug("Express instance created");
const api = new GatherApi();

app.use(bodyParser.raw({type: 'application/octet-stream', limit : '2mb'}))
app.post("/api", api.handleApiRequest);
LOG.debug("Finished setting up routes");

app.listen(SERVER_PORT)
LOG.debug(`Now listening on port ${SERVER_PORT}`)