import { User } from "@domain/user";
import { UserRepository } from "@repositories/user-repository";

export class GetAllUsersUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(): Promise<User[]> {
		try {
			return await this.userRepository.getAll();
		} catch (error: any) {
			throw error;
		}
	}
}
