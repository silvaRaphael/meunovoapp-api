import { Chat } from "../../../domain/chat";
import { CreateChatSchema } from "../../adapters/chat";
import { ChatRepository } from "../../repositories/chat-repository";

export class CreateChatUseCase {
	constructor(private chatRepository: ChatRepository) {}

	async execute(chat: CreateChatSchema & { user_id: string }): Promise<void> {
		try {
			const chatToCreate = new Chat({
				id: chat.id,
				participants_id: [chat.user_id, chat.receiver_id],
			});

			await this.chatRepository.create(chatToCreate);
		} catch (error: any) {
			throw error;
		}
	}
}
