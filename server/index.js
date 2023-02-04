/* eslint-disable no-console */
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import indexRouter from "./routes/index.js";
import { connectToDB } from "./utils.js";

const PORT = process.env.PORT || 8000;

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api", indexRouter);

(async function init() {
    try {
        await connectToDB();
        app.listen(PORT, () => console.log(`Express is listening at http://localhost:${PORT}`));
    } catch (err) {
        console.warn(err);
    }
}());
