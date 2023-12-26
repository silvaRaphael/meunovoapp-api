import { ChatRepository } from "../../repositories/chat-repository";

export class MarkAsReadChatUseCase {
	constructor(private chatRepository: ChatRepository) {}

	async execute(id: string): Promise<void> {
		try {
			await this.chatRepository.markAsRead(id);
		} catch (error) {
			throw error;
		}
	}
}
