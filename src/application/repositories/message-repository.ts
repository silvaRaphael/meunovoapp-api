import { Message } from "../../domain/message";
import { UpdateMessageSchema } from "../adapters/message";

export interface MessageRepository {
	create(message: Message): Promise<void>;
	markAsRead(message: UpdateMessageSchema): Promise<void>;
	getAll(chat_id: string): Promise<Message[]>;
}
