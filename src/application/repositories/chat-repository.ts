import { Chat } from "../../domain/chat";
import { User } from "../../domain/user";

export interface ChatRepository {
	create(chat: Chat): Promise<void>;
	markAsRead(id: string): Promise<void>;
	getOne(id: string): Promise<Chat | null>;
	getUsers(user_id: string): Promise<User[]>;
	getContacts(user_id: string): Promise<Chat[]>;
	getMessages({
		user_id,
		receiver_id,
	}: {
		user_id: string;
		receiver_id: string;
	}): Promise<Chat[]>;
}
