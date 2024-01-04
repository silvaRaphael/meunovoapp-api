import { Router } from "express";
import { prisma } from "../../database/prisma";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { NotificationRepositoryImpl } from "../../database/repositories/notification-repository-impl";
import { GetAllNotificationsUseCase } from "../../../application/use-cases/notification-use-case/get-all-notifications-use-case";
import { NotificationController } from "../controllers/notification-controller";
import { LanguageMiddleware } from "../middlewares/language-middleware";
import { MarkAsReadNotificationUseCase } from "../../../application/use-cases/notification-use-case/mark-as-read-notification-use-case";

const routes = Router();

const notificationRepository = new NotificationRepositoryImpl(prisma);

const getAllNotificationsUseCase = new GetAllNotificationsUseCase(
	notificationRepository,
);
const markAsReadNotificationUseCase = new MarkAsReadNotificationUseCase(
	notificationRepository,
);

const projectController = new NotificationController(
	getAllNotificationsUseCase,
	markAsReadNotificationUseCase,
);

routes.get("/", LanguageMiddleware, AuthMiddleware, (req, res) => {
	projectController.getAllNotifications(req, res);
});

routes.put("/", LanguageMiddleware, AuthMiddleware, (req, res) => {
	projectController.markAsReadNotification(req, res);
});

export default routes;
