import { Router } from "express";

import auth from "./auth";
import email from "./email";
import notifications from "./notification";
import client from "./client";
import user from "./user";
import project from "./project";
import task from "./task";

const routes = Router();

routes.use("/auth", auth);
routes.use("/emails", email);
routes.use("/notifications", notifications);
routes.use("/clients", client);
routes.use("/users", user);
routes.use("/projects", project);
routes.use("/tasks", task);

routes.get("/", (_, res) => res.end());

export { routes };
