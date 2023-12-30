import { MessageRepository } from "../../repositories/message-repository";

export class MarkAsReadMessageUseCase {
	constructor(private messageRepository: MessageRepository) {}

	async execute(id: string): Promise<void> {
		try {
			await this.messageRepository.markAsRead(id);
		} catch (error) {
			throw error;
		}
	}
}
