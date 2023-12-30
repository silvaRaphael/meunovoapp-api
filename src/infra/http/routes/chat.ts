import { Router } from "express";
import { prisma } from "../../database/prisma";
import { ChatRepositoryImpl } from "../../database/repositories/chat-repository-impl";
import { CreateChatUseCase } from "../../../application/use-cases/chat-use-case/create-chat-use-case";
import { ChatController } from "../controllers/chat-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { GetAllChatsUseCase } from "../../../application/use-cases/chat-use-case/get-all-chats-use-case";
import { GetUsersChatUseCase } from "../../../application/use-cases/chat-use-case/get-users-use-case";

const routes = Router();

const chatRepository = new ChatRepositoryImpl(prisma);

const createChatUseCase = new CreateChatUseCase(chatRepository);
const getUsersChatUseCase = new GetUsersChatUseCase(chatRepository);
const getAllChatsUseCase = new GetAllChatsUseCase(chatRepository);

const chatController = new ChatController(
	createChatUseCase,
	getUsersChatUseCase,
	getAllChatsUseCase,
);

routes.post("/", AuthMiddleware, (req, res) => {
	chatController.createChat(req, res);
});

routes.get("/users", AuthMiddleware, (req, res) => {
	chatController.getUsers(req, res);
});

routes.get("/", AuthMiddleware, (req, res) => {
	chatController.getAll(req, res);
});

export default routes;
