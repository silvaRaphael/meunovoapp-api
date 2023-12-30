import { Message } from "../../domain/message";

export interface MessageRepository {
	create(message: Message): Promise<void>;
	markAsRead(id: string): Promise<void>;
	getAll(chat_id: string): Promise<Message[]>;
}
