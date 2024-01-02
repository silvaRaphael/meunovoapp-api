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
import { GetMeessageNotificationsUseCase } from "../../../application/use-cases/message-use-case/get-message-notifications-use-case";
import { UserNotFoundError } from "../../../application/errors";

export class MessageController {
	constructor(
		private createMessageUseCase: CreateMessageUseCase,
		private createChatUseCase: CreateChatUseCase,
		private getChatUseCase: GetChatUseCase,
		private markAsReadMessageUseCase: MarkAsReadMessageUseCase,
		private getAllMessagesUseCase: GetAllMessagesUseCase,
		private getMeessageNotificationsUseCase: GetMeessageNotificationsUseCase,
	) {}

	async createMessage(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;
			const { chat_id, text, labels, receiver_id } =
				createMessageSchema.parse(req.body);

			if (!userId) throw new UserNotFoundError(req);

			const chatExistent = await this.getChatUseCase.execute(chat_id);

			if (!chatExistent) {
				if (!receiver_id) throw new UserNotFoundError(req);

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
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async markAsRead(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;
			const { chat_id } = updateMessageSchema.parse({
				chat_id: req.params.chatId,
			});

			if (!userId) throw new UserNotFoundError(req);

			await this.markAsReadMessageUseCase.execute({
				user_id: userId,
				chat_id,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async getMessages(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;
			const { chatId } = req.params;

			if (!userId) throw new UserNotFoundError(req);

			const response = await this.getAllMessagesUseCase.execute(chatId);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async getMessageNotifications(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;

			if (!userId) throw new UserNotFoundError(req);

			const response = await this.getMeessageNotificationsUseCase.execute(
				userId,
			);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}
}
