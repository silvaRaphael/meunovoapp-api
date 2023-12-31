import { Router } from "express";
import { prisma } from "../../database/prisma";
import { MessageRepositoryImpl } from "../../database/repositories/message-repository-impl";
import { CreateMessageUseCase } from "../../../application/use-cases/message-use-case/create-message-use-case";
import { MessageController } from "../controllers/message-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { MarkAsReadMessageUseCase } from "../../../application/use-cases/message-use-case/mark-as-read-message-use-case";
import { GetAllMessagesUseCase } from "../../../application/use-cases/message-use-case/get-all-message-use-case";
import { CreateChatUseCase } from "../../../application/use-cases/chat-use-case/create-chat-use-case";
import { GetChatUseCase } from "../../../application/use-cases/chat-use-case/get-chat-use-case";
import { ChatRepositoryImpl } from "../../database/repositories/chat-repository-impl";
import { GetMeessageNotificationsUseCase } from "../../../application/use-cases/message-use-case/get-message-notifications-use-case";

const routes = Router();

const messageRepository = new MessageRepositoryImpl(prisma);
const chatRepository = new ChatRepositoryImpl(prisma);

const createMessageUseCase = new CreateMessageUseCase(messageRepository);
const createChatUseCase = new CreateChatUseCase(chatRepository);
const getChatUseCase = new GetChatUseCase(chatRepository);
const markAsReadMessageUseCase = new MarkAsReadMessageUseCase(
	messageRepository,
);
const getAllMessagesUseCase = new GetAllMessagesUseCase(messageRepository);
const getMeessageNotificationsUseCase = new GetMeessageNotificationsUseCase(
	messageRepository,
);

const messageController = new MessageController(
	createMessageUseCase,
	createChatUseCase,
	getChatUseCase,
	markAsReadMessageUseCase,
	getAllMessagesUseCase,
	getMeessageNotificationsUseCase,
);

routes.post("/", AuthMiddleware, (req, res) => {
	messageController.createMessage(req, res);
});

routes.put("/:chatId", AuthMiddleware, (req, res) => {
	messageController.markAsRead(req, res);
});

routes.get("/:chatId", AuthMiddleware, (req, res) => {
	messageController.getMessages(req, res);
});

routes.get("/", AuthMiddleware, (req, res) => {
	messageController.getMessageNotifications(req, res);
});

export default routes;
