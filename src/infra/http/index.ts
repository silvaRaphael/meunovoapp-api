import express from "express";
import cors from "cors";
import session from "express-session";
import { routes } from "./routes";

const PORT = process.env.PORT || 3333;

const app = express();

app.use(express.json());
app.use(cors());
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
