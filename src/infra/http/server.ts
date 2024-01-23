import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { routes } from "./routes";
import files from "./routes/file";
import { httpAllowedOrigins } from "../config/allowed-origins";

const app = express();
const server = createServer(app);

app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: httpAllowedOrigins,
		methods: ["GET", "POST", "PUT", "DELETE"],
	}),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.static("/app/files"));

app.use("/v1", routes);
app.use("/files", files);

app.get("/", (_, res) => res.end());

export { server };
