import express from "express";
import cors from "cors";
import { routes } from "@routes/index";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/v1/api", routes);

app.listen(PORT, () =>
	console.log(`Server is running on ${process.env.SITE_URI}`),
);
