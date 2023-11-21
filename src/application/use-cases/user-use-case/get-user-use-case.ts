import { User } from "@domain/user";
import { UserRepository } from "@repositories/user-repository";

export class GetUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(id: string): Promise<User | null> {
		try {
			return await this.userRepository.getOne(id);
		} catch (error: any) {
			throw error;
		}
	}
}
