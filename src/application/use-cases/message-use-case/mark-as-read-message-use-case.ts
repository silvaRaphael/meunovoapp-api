import { UpdateMessageSchema } from "../../adapters/message";
import { MessageRepository } from "../../repositories/message-repository";

export class MarkAsReadMessageUseCase {
	constructor(private messageRepository: MessageRepository) {}

	async execute(message: UpdateMessageSchema): Promise<void> {
		try {
			await this.messageRepository.markAsRead(message);
		} catch (error) {
			throw error;
		}
	}
}
