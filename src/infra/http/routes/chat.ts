import { Router } from "express";
import { prisma } from "../../database/prisma";
import { ChatRepositoryImpl } from "../../database/repositories/chat-repository-impl";
import { CreateChatUseCase } from "../../../application/use-cases/chat-use-case/create-chat-use-case";
import { GetChatUseCase } from "../../../application/use-cases/chat-use-case/get-chat-use-case";
import { ChatController } from "../controllers/chat-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { RoleMiddleware } from "../middlewares/role-middleware";
import { ManagerMiddleware } from "../middlewares/manager-middleware";
import { UploadFileUseCase } from "../../../application/use-cases/file-use-case/upload-file-use-case";
import { MarkAsReadChatUseCase } from "../../../application/use-cases/chat-use-case/mark-as-read-chat-use-case";
import { GetMessagesChatUseCase } from "../../../application/use-cases/chat-use-case/get-messages-chat-use-case";
import { GetContactsChatUseCase } from "../../../application/use-cases/chat-use-case/get-contacts-chat-use-case";
import { GetUsersChatUseCase } from "../../../application/use-cases/chat-use-case/get-users-use-case";

const routes = Router();

const chatRepository = new ChatRepositoryImpl(prisma);

const createChatUseCase = new CreateChatUseCase(chatRepository);
const markAsReadChatUseCase = new MarkAsReadChatUseCase(chatRepository);
const getUsersChatUseCase = new GetUsersChatUseCase(chatRepository);
const getContactsChatUseCase = new GetContactsChatUseCase(chatRepository);
const getMessagesChatUseCase = new GetMessagesChatUseCase(chatRepository);
const getChatUseCase = new GetChatUseCase(chatRepository);

const chatController = new ChatController(
	createChatUseCase,
	markAsReadChatUseCase,
	getUsersChatUseCase,
	getContactsChatUseCase,
	getMessagesChatUseCase,
	getChatUseCase,
);

routes.post("/", AuthMiddleware, (req, res) => {
	chatController.createChat(req, res);
});

routes.put("/:id", AuthMiddleware, (req, res) => {
	chatController.markAsRead(req, res);
});

routes.get("/users", AuthMiddleware, (req, res) => {
	chatController.getUsers(req, res);
});

routes.get("/", AuthMiddleware, (req, res) => {
	chatController.getContacts(req, res);
});

routes.get("/:receiverId", AuthMiddleware, (req, res) => {
	chatController.getMessages(req, res);
});

routes.get("/:id", AuthMiddleware, (req, res) => {
	chatController.getChat(req, res);
});

export default routes;
