import { Router } from "express";

import auth from "./auth";
import emails from "./emails";

const routes = Router();

routes.use("/auth", auth);
routes.use("/emails", emails);

export { routes };
