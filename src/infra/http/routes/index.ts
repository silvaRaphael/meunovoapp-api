import { Router } from "express";

import auth from "./auth";
import email from "./email";
import client from "./client";
import user from "./user";
import project from "./project";
import task from "./task";

const routes = Router();

routes.use("/auth", auth);
routes.use("/emails", email);
routes.use("/clients", client);
routes.use("/users", user);
routes.use("/projects", project);
routes.use("/tasks", task);

routes.get("/", (_, res) => res.send(`API v1`));

export { routes };
