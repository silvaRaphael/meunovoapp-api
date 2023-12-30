import { Message } from "../../../domain/message";
import { CreateMessageSchema } from "../../adapters/message";
import { MessageRepository } from "../../repositories/message-repository";

export class CreateMessageUseCase {
	constructor(private messageRepository: MessageRepository) {}

	async execute(
		chat: CreateMessageSchema & { user_id: string },
	): Promise<void> {
		try {
			const messageToCreate = new Message({
				chat_id: chat.chat_id,
				user_id: chat.user_id,
				text: chat.text,
				labels: chat.labels,
			});

			await this.messageRepository.create(messageToCreate);
		} catch (error: any) {
			throw error;
		}
	}
}
