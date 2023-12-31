import { Message } from "../../../domain/message";
import { CreateMessageSchema } from "../../adapters/message";
import { MessageRepository } from "../../repositories/message-repository";

export class CreateMessageUseCase {
	constructor(private messageRepository: MessageRepository) {}

	async execute(
		message: CreateMessageSchema & { user_id: string },
	): Promise<{ participant_id: string; ws_token: string | null }> {
		try {
			const messageToCreate = new Message({
				id: message.id,
				chat_id: message.chat_id,
				user_id: message.user_id,
				text: message.text,
				labels: message.labels,
			});

			return await this.messageRepository.create(messageToCreate);
		} catch (error: any) {
			throw error;
		}
	}
}
