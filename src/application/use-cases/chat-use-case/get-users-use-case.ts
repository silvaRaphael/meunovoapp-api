import { User } from "../../../domain/user";
import { ChatRepository } from "../../repositories/chat-repository";

export class GetUsersChatUseCase {
	constructor(private chatRepository: ChatRepository) {}

	async execute(user_id: string): Promise<User[]> {
		try {
			return await this.chatRepository.getUsers(user_id);
		} catch (error: any) {
			throw error;
		}
	}
}
