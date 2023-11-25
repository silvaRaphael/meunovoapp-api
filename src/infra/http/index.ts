import express from "express";
import cors from "cors";
import session from "express-session";
import { routes } from "./routes";

const PORT = process.env.PORT || 3333;

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: function (origin, callback) {
			console.log(origin);
			const allowedOrigins = [
				"https://meunovoapp.com.br",
				"https://console.meunovoapp.com.br",
				"https://api.meunovoapp.com.br",
				"http://localhost:3000",
				"http://localhost:3333",
				"http://localhost:5000",
			];
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
		optionsSuccessStatus: 204,
	}),
);
app.use(
	session({
		secret: process.env.SECRET || "",
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 3600_000 },
	}),
);

app.use("/v1/api", routes);

app.get("/", (_, res) =>
	res.send(
		`API is on <a href="${process.env.SITE_URI}/v1/api">${process.env.SITE_URI}/v1/api</a>`,
	),
);

app.listen(PORT, () =>
	console.log(`Server is running on ${process.env.SITE_URI}`),
);
