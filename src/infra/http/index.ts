import express from "express";
import cors from "cors";
import { routes } from "./routes";
import files from "./routes/file";

const PORT = process.env.PORT || 3333;

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.static("/app/files"));

app.use("/v1/api", routes);
app.use("/files", files);

app.get("/", (_, res) => res.end());

app.listen(PORT, () =>
	console.log(`Server is running on ${process.env.SITE_URI}`),
);
