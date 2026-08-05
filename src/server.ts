import express from "express";
import { config } from "dotenv";
import routes from "./router";
import { connectDB } from "./config/db";

const app = express();
config();
connectDB();

// leer datos de formularios JSON
app.use(express.json());

//* Routing */

app.use("/api", routes);

export default app;
