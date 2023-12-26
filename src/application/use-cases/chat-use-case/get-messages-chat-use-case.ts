import { Chat } from "../../../domain/chat";
import { ChatRepository } from "../../repositories/chat-repository";

export class GetMessagesChatUseCase {
	constructor(private chatRepository: ChatRepository) {}

	async execute({
		user_id,
		receiver_id,
	}: {
		user_id: string;
		receiver_id: string;
	}): Promise<Chat[]> {
		try {
			return await this.chatRepository.getMessages({
				user_id,
				receiver_id,
			});
		} catch (error: any) {
			throw error;
		}
	}
}
