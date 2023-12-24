import express from "express";
import cors from "cors";
import { routes } from "./routes";
import files from "./routes/file";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3333;

const app = express();

app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: [
			"http://localhost:3000",
			"https://console.meunovoapp.com.br",
			"https://www.meunovoapp.com.br",
			"https://meunovoapp.com.br",
		],
		methods: ["GET", "POST", "PUT"],
	}),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.static("/app/files"));

app.use("/v1", routes);
app.use("/files", files);

app.get("/", (_, res) => res.end());

app.listen(PORT, () =>
	console.log(`Server is running on ${process.env.SITE_URI}`),
);
