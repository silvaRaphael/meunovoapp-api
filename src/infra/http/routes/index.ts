import { Router } from "express";

import auth from "./auth";
import dashboard from "./dashboard";
import email from "./email";
import notifications from "./notification";
import client from "./client";
import user from "./user";
import preferences from "./user-preferences";
import project from "./project";
import task from "./task";
import chat from "./chat";

const routes = Router();

routes.use("/auth", auth);
routes.use("/dashboard", dashboard);
routes.use("/emails", email);
routes.use("/notifications", notifications);
routes.use("/clients", client);
routes.use("/users", user);
routes.use("/preferences", preferences);
routes.use("/projects", project);
routes.use("/tasks", task);
routes.use("/chats", chat);

routes.get("/", (_, res) => res.end());

export { routes };
