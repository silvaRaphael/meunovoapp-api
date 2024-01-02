import { Router } from "express";
import { prisma } from "../../database/prisma";
import { ProjectRepositoryImpl } from "../../database/repositories/project-repository-impl";
import { GetAllProjectsUseCase } from "../../../application/use-cases/project-use-case/get-all-projects-use-case";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { DashboardController } from "../controllers/dashboard-controller";
import { GetAllUsersUseCase } from "../../../application/use-cases/user-use-case/get-all-users-use-case";
import { UserRepositoryImpl } from "../../database/repositories/user-repository-impl";
import { LanguageMiddleware } from "../middlewares/language-middleware";

const routes = Router();

const projectRepository = new ProjectRepositoryImpl(prisma);
const userRepository = new UserRepositoryImpl(prisma);

const getProjectUseCase = new GetAllProjectsUseCase(projectRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

const dashboardController = new DashboardController(
	getProjectUseCase,
	getAllUsersUseCase,
);

routes.get("/projects", LanguageMiddleware, AuthMiddleware, (req, res) => {
	dashboardController.getProjects(req, res);
});

routes.get("/users", LanguageMiddleware, AuthMiddleware, (req, res) => {
	dashboardController.getUsers(req, res);
});

export default routes;
