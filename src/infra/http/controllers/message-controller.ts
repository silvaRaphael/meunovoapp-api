import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { AuthRequest } from "../../config/auth-request";
import {
	createMessageSchema,
	updateMessageSchema,
} from "../../../application/adapters/message";
import { MarkAsReadMessageUseCase } from "../../../application/use-cases/message-use-case/mark-as-read-message-use-case";
import { GetAllMessagesUseCase } from "../../../application/use-cases/message-use-case/get-all-message-use-case";
import { CreateMessageUseCase } from "../../../application/use-cases/message-use-case/create-message-use-case";
import { CreateChatUseCase } from "../../../application/use-cases/chat-use-case/create-chat-use-case";
import { GetChatUseCase } from "../../../application/use-cases/chat-use-case/get-chat-use-case";

export class MessageController {
	constructor(
		private createMessageUseCase: CreateMessageUseCase,
		private createChatUseCase: CreateChatUseCase,
		private getChatUseCase: GetChatUseCase,
		private markAsReadMessageUseCase: MarkAsReadMessageUseCase,
		private getAllMessagesUseCase: GetAllMessagesUseCase,
	) {}

	async createMessage(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;
			const { chat_id, text, labels, receiver_id } =
				createMessageSchema.parse(req.body);

			if (!userId) throw new Error("Usuário não encontrado.");

			const chatExistent = await this.getChatUseCase.execute(chat_id);

			if (!chatExistent) {
				if (!receiver_id) throw new Error("Usuário não encontrado.");

				await this.createChatUseCase.execute({
					id: chat_id,
					user_id: userId,
					receiver_id,
				});
			}

			await this.createMessageUseCase.execute({
				user_id: userId,
				chat_id,
				text,
				labels,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async markAsRead(req: Request, res: Response) {
		try {
			const { id } = updateMessageSchema.parse(req.params);

			await this.markAsReadMessageUseCase.execute(id);

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getMessages(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;
			const { chatId } = req.params;

			if (!userId) throw new Error("Usuário não encontrado.");

			const response = await this.getAllMessagesUseCase.execute(chatId);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}
}
