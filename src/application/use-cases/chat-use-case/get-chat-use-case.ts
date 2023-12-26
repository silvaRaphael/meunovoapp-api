import { Chat } from "../../../domain/chat";
import { ChatRepository } from "../../repositories/chat-repository";

export class GetChatUseCase {
	constructor(private chatRepository: ChatRepository) {}

	async execute(id: string): Promise<Chat | null> {
		try {
			return await this.chatRepository.getOne(id);
		} catch (error: any) {
			throw error;
		}
	}
}
