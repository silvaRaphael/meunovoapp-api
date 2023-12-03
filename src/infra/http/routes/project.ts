import { Router } from "express";
import { prisma } from "../../database/prisma";
import { ProjectRepositoryImpl } from "../../database/repositories/project-repository-impl";
import { CreateProjectUseCase } from "../../../application/use-cases/project-use-case/create-project-use-case";
import { UpdateProjectUseCase } from "../../../application/use-cases/project-use-case/update-project-use-case";
import { GetAllProjectsUseCase } from "../../../application/use-cases/project-use-case/get-all-projects-use-case";
import { GetProjectUseCase } from "../../../application/use-cases/project-use-case/get-project-use-case";
import { ProjectController } from "../controllers/project-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { RoleMiddleware } from "../middlewares/role-middleware";

const routes = Router();

const projectRepository = new ProjectRepositoryImpl(prisma);

const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepository);
const getProjectUseCase = new GetProjectUseCase(projectRepository);

const projectController = new ProjectController(
	createProjectUseCase,
	updateProjectUseCase,
	getAllProjectsUseCase,
	getProjectUseCase,
);

routes.post("/", AuthMiddleware, RoleMiddleware, (req, res) => {
	projectController.createProject(req, res);
});

routes.put("/:id", AuthMiddleware, RoleMiddleware, (req, res) => {
	projectController.updateProject(req, res);
});

routes.get("/", AuthMiddleware, RoleMiddleware, (req, res) => {
	projectController.getAllProjects(req, res);
});

routes.get("/:id", AuthMiddleware, RoleMiddleware, (req, res) => {
	projectController.getProject(req, res);
});

routes.get("/can-update/:id", AuthMiddleware, RoleMiddleware, (req, res) => {
	projectController.canUpdate(req, res);
});

export default routes;
