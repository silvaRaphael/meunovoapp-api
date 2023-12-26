import { Chat } from "../../../domain/chat";
import { CreateChatSchema } from "../../adapters/chat";
import { ChatRepository } from "../../repositories/chat-repository";

export class CreateChatUseCase {
	constructor(private chatRepository: ChatRepository) {}

	async execute(chat: CreateChatSchema & { user_id: string }): Promise<void> {
		try {
			const chatToCreate = new Chat(chat);

			await this.chatRepository.create(chatToCreate);
		} catch (error: any) {
			throw error;
		}
	}
}
