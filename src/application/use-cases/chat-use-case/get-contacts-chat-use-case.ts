import { Chat } from "../../../domain/chat";
import { ChatRepository } from "../../repositories/chat-repository";

export class GetContactsChatUseCase {
	constructor(private chatRepository: ChatRepository) {}

	async execute(user_id: string): Promise<Chat[]> {
		try {
			return await this.chatRepository.getContacts(user_id);
		} catch (error: any) {
			throw error;
		}
	}
}
