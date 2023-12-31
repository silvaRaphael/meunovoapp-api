import { Message } from "../../../domain/message";
import { MessageRepository } from "../../repositories/message-repository";

export class GetMeessageNotificationsUseCase {
	constructor(private messageRepository: MessageRepository) {}

	async execute(user_id: string): Promise<Message[]> {
		try {
			return await this.messageRepository.getNotifications(user_id);
		} catch (error: any) {
			throw error;
		}
	}
}
