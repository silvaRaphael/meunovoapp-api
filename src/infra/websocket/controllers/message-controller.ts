import {
	CreateMessageSchema,
	UpdateMessageSchema,
	createMessageSchema,
	updateMessageSchema,
} from "../../../application/adapters/message";
import { MarkAsReadMessageUseCase } from "../../../application/use-cases/message-use-case/mark-as-read-message-use-case";
import { GetAllMessagesUseCase } from "../../../application/use-cases/message-use-case/get-all-message-use-case";
import { CreateMessageUseCase } from "../../../application/use-cases/message-use-case/create-message-use-case";
import { CreateChatUseCase } from "../../../application/use-cases/chat-use-case/create-chat-use-case";
import { GetChatUseCase } from "../../../application/use-cases/chat-use-case/get-chat-use-case";
import { HandleError } from "../../http/utils/handle-error";
import { Socket } from "socket.io";
import { MessageUser } from "../../../domain/message";

export class WSMessageController {
	constructor(
		private createMessageUseCase: CreateMessageUseCase,
		private createChatUseCase: CreateChatUseCase,
		private getChatUseCase: GetChatUseCase,
		private markAsReadMessageUseCase: MarkAsReadMessageUseCase,
		private getAllMessagesUseCase: GetAllMessagesUseCase,
	) {}

	async createMessage(
		socket: Socket,
		auth: MessageUser,
		body: CreateMessageSchema,
	) {
		try {
			const { id } = auth;
			const { chat_id, text, labels, receiver_id } =
				createMessageSchema.parse(body);

			const chatExistent = await this.getChatUseCase.execute(chat_id);

			if (!chatExistent) {
				if (!receiver_id) throw new Error("Usuário não encontrado.");

				await this.createChatUseCase.execute({
					id: chat_id,
					user_id: id,
					receiver_id,
				});
			}

			return await this.createMessageUseCase.execute({
				user_id: id,
				chat_id,
				text,
				labels,
			});
		} catch (error: any) {
			socket.emit("error", { error: HandleError(error) });
		}
	}

	async markAsRead(socket: Socket, message: UpdateMessageSchema) {
		try {
			const { chat_id, user_id } = updateMessageSchema.parse(message);

			await this.markAsReadMessageUseCase.execute({
				chat_id,
				user_id,
			});
		} catch (error: any) {
			socket.emit("error", { error: HandleError(error) });
		}
	}

	async getMessages(socket: Socket, chat_id: string) {
		try {
			const response = await this.getAllMessagesUseCase.execute(chat_id);

			socket.emit("messages", response);
		} catch (error: any) {
			socket.emit("error", { error: HandleError(error) });
		}
	}
}
