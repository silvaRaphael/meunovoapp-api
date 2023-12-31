import { Message } from "../../domain/message";
import { UpdateMessageSchema } from "../adapters/message";

export interface MessageRepository {
	create(
		message: Message,
	): Promise<{ participant_id: string; ws_token: string | null }>;
	markAsRead(message: UpdateMessageSchema): Promise<void>;
	getAll(chat_id: string): Promise<Message[]>;
	getNotifications(user_id: string): Promise<Message[]>;
}
