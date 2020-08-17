import express from 'express';
import bodyParser from 'body-parser';
import {GatherApi} from "./api";

const app = express();

const api = new GatherApi();


app.use(bodyParser.raw({type: 'application/octet-stream', limit : '2mb'}))
app.post("/api", handleApi);

app.get("/", function(req, res) {
    res.send("Hello World")
})
app.listen(3000)