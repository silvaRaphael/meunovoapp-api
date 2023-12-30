import { Chat } from "../../domain/chat";
import { User } from "../../domain/user";

export interface ChatRepository {
	create(chat: Chat): Promise<void>;
	getOne(chat_id: string): Promise<Chat | null>;
	getUsers(user_id: string): Promise<User[]>;
	getAll(user_id: string): Promise<Chat[]>;
}
