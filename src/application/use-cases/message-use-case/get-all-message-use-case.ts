import { Message } from "../../../domain/message";
import { MessageRepository } from "../../repositories/message-repository";

export class GetAllMessagesUseCase {
	constructor(private messageRepository: MessageRepository) {}

	async execute(chat_id: string): Promise<Message[]> {
		try {
			return await this.messageRepository.getAll(chat_id);
		} catch (error: any) {
			throw error;
		}
	}
}
