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
import { CreateNotificationUseCase } from "../../../application/use-cases/notification-use-case/create-notification-use-case";
import { NotificationRepositoryImpl } from "../../database/repositories/notification-repository-impl";
import { SendEmailUseCase } from "../../../application/use-cases/email-use-case/send-email-use-case";
import { EmailRepositoryImpl } from "../../database/repositories/email-repository-impl";
import { mailSender } from "../../providers/nodemailer";

const routes = Router();

const projectRepository = new ProjectRepositoryImpl(prisma);
const notificationRepository = new NotificationRepositoryImpl(prisma);
const emailRepository = new EmailRepositoryImpl(prisma, mailSender);

const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);
const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepository);
const getProjectUseCase = new GetProjectUseCase(projectRepository);

const createNotificationUseCase = new CreateNotificationUseCase(
	notificationRepository,
);

const sendEmailUseCase = new SendEmailUseCase(emailRepository);

const projectController = new ProjectController(
	createProjectUseCase,
	updateProjectUseCase,
	getAllProjectsUseCase,
	getProjectUseCase,
	createNotificationUseCase,
	sendEmailUseCase,
);

routes.post("/", AuthMiddleware, RoleMiddleware, (req, res) => {
	projectController.createProject(req, res);
});

routes.put("/:id", AuthMiddleware, RoleMiddleware, (req, res) => {
	projectController.updateProject(req, res);
});

routes.get("/", AuthMiddleware, (req, res) => {
	projectController.getAllProjects(req, res);
});

routes.get("/:id", AuthMiddleware, (req, res) => {
	projectController.getProject(req, res);
});

routes.get("/can-update/:id", AuthMiddleware, RoleMiddleware, (req, res) => {
	projectController.canUpdate(req, res);
});

export default routes;
