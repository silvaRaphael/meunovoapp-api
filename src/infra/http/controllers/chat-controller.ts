import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { createChatSchema } from "../../../application/adapters/chat";
import { CreateChatUseCase } from "../../../application/use-cases/chat-use-case/create-chat-use-case";
import { GetAllChatsUseCase } from "../../../application/use-cases/chat-use-case/get-all-chats-use-case";
import { GetUsersChatUseCase } from "../../../application/use-cases/chat-use-case/get-users-use-case";
import { AuthRequest } from "../../config/auth-request";

export class ChatController {
	constructor(
		private createChatUseCase: CreateChatUseCase,
		private getUsersChatUseCase: GetUsersChatUseCase,
		private getAllChatsUseCase: GetAllChatsUseCase,
	) {}

	async createChat(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;
			const { receiver_id } = createChatSchema.parse(req.body);

			if (!userId) throw new Error("Usuário não encontrado.");

			await this.createChatUseCase.execute({
				user_id: userId,
				receiver_id,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getUsers(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;

			if (!userId) throw new Error("Usuário não encontrado.");

			const response = await this.getUsersChatUseCase.execute(userId);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getAll(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;

			if (!userId) throw new Error("Usuário não encontrado.");

			const response = await this.getAllChatsUseCase.execute(userId);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}
}
