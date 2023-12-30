import { Chat } from "../../../domain/chat";
import { ChatRepository } from "../../repositories/chat-repository";

export class GetChatUseCase {
	constructor(private chatRepository: ChatRepository) {}

	async execute(chat_id: string): Promise<Chat | null> {
		try {
			return await this.chatRepository.getOne(chat_id);
		} catch (error: any) {
			throw error;
		}
	}
}
