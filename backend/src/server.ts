import express from "express";
import { config } from "dotenv";
import cors from "cors";
import routes from "./router";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";

const app = express();
config();
connectDB();

//* CORS */

app.use(cors(corsConfig));

// leer datos de formularios JSON
app.use(express.json());

//* Routing */

app.use("/api/v1", routes);

export default app;
