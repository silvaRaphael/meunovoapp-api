import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import {
	createChatSchema,
	updateChatSchema,
} from "../../../application/adapters/chat";
import { CreateChatUseCase } from "../../../application/use-cases/chat-use-case/create-chat-use-case";
import { GetMessagesChatUseCase } from "../../../application/use-cases/chat-use-case/get-messages-chat-use-case";
import { GetChatUseCase } from "../../../application/use-cases/chat-use-case/get-chat-use-case";
import { MarkAsReadChatUseCase } from "../../../application/use-cases/chat-use-case/mark-as-read-chat-use-case";
import { AuthRequest } from "../../config/auth-request";
import { GetContactsChatUseCase } from "../../../application/use-cases/chat-use-case/get-contacts-chat-use-case";
import { GetUsersChatUseCase } from "../../../application/use-cases/chat-use-case/get-users-use-case";

export class ChatController {
	constructor(
		private createChatUseCase: CreateChatUseCase,
		private markAsReadChatUseCase: MarkAsReadChatUseCase,
		private getUsersChatUseCase: GetUsersChatUseCase,
		private getContactsChatUseCase: GetContactsChatUseCase,
		private getMessagesChatUseCase: GetMessagesChatUseCase,
		private getChatUseCase: GetChatUseCase,
	) {}

	async createChat(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;
			const { receiver_id, text, labels } = createChatSchema.parse(
				req.body,
			);

			if (!userId) throw new Error("Usuário não encontrado.");

			await this.createChatUseCase.execute({
				user_id: userId,
				receiver_id,
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
			const { id } = updateChatSchema.parse(req.params);

			await this.markAsReadChatUseCase.execute(id);

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

	async getContacts(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;

			if (!userId) throw new Error("Usuário não encontrado.");

			const response = await this.getContactsChatUseCase.execute(userId);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getMessages(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;
			const { receiverId } = req.params;

			if (!userId) throw new Error("Usuário não encontrado.");

			const response = await this.getMessagesChatUseCase.execute({
				user_id: userId,
				receiver_id: receiverId,
			});

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getChat(req: Request, res: Response) {
		try {
			const { id } = updateChatSchema.parse(req.params);

			const response = await this.getChatUseCase.execute(id);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}
}
