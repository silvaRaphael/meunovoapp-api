import { Router } from "express";
import { prisma } from "../../database/prisma";
import { TaskRepositoryImpl } from "../../database/repositories/task-repository-impl";
import { CreateTaskUseCase } from "../../../application/use-cases/task-use-case/create-task-use-case";
import { UpdateTaskUseCase } from "../../../application/use-cases/task-use-case/update-task-use-case";
import { GetAllTasksUseCase } from "../../../application/use-cases/task-use-case/get-all-tasks-use-case";
import { GetTaskUseCase } from "../../../application/use-cases/task-use-case/get-task-use-case";
import { TaskController } from "../controllers/task-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { RoleMiddleware } from "../middlewares/role-middleware";
import { NotificationRepositoryImpl } from "../../database/repositories/notification-repository-impl";
import { CreateNotificationUseCase } from "../../../application/use-cases/notification-use-case/create-notification-use-case";

const routes = Router();

const taskRepository = new TaskRepositoryImpl(prisma);
const notificationRepository = new NotificationRepositoryImpl(prisma);

const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
const getTaskUseCase = new GetTaskUseCase(taskRepository);

const createNotificationUseCase = new CreateNotificationUseCase(
	notificationRepository,
);

const taskController = new TaskController(
	createTaskUseCase,
	updateTaskUseCase,
	getAllTasksUseCase,
	getTaskUseCase,
	createNotificationUseCase,
);

routes.post("/", AuthMiddleware, RoleMiddleware, (req, res) => {
	taskController.createTask(req, res);
});

routes.put("/:id", AuthMiddleware, RoleMiddleware, (req, res) => {
	taskController.updateTask(req, res);
});

routes.get("/", AuthMiddleware, (req, res) => {
	taskController.getAllTasks(req, res);
});

routes.get("/:id", AuthMiddleware, (req, res) => {
	taskController.getTask(req, res);
});

routes.get("/can-update/:id", AuthMiddleware, RoleMiddleware, (req, res) => {
	taskController.canUpdate(req, res);
});

export default routes;
