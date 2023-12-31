import { User } from "../../../domain/user";
import { ChatRepository } from "../../repositories/chat-repository";

export class GetUsersChatUseCase {
	constructor(private chatRepository: ChatRepository) {}

	async execute(filter: {
		user_id: string;
		client_id?: string;
	}): Promise<User[]> {
		try {
			return await this.chatRepository.getUsers(filter);
		} catch (error: any) {
			throw error;
		}
	}
}
