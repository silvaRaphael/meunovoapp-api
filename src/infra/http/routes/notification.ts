import { Router } from "express";
import { prisma } from "../../database/prisma";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { NotificationRepositoryImpl } from "../../database/repositories/notification-repository-impl";
import { GetAllNotificationsUseCase } from "../../../application/use-cases/notification-use-case/get-all-notifications-use-case";
import { NotificationController } from "../controllers/notification-controller";

const routes = Router();

const notificationRepository = new NotificationRepositoryImpl(prisma);

const getAllNotificationsUseCase = new GetAllNotificationsUseCase(
	notificationRepository,
);

const projectController = new NotificationController(
	getAllNotificationsUseCase,
);

routes.get("/", AuthMiddleware, (req, res) => {
	projectController.getAllNotifications(req, res);
});

export default routes;
