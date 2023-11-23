import { User } from "../../../domain/user";
import { UserRepository } from "../../repositories/user-repository";

export class GetUserByEmailUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(email: string): Promise<User | null> {
		try {
			return await this.userRepository.getOneByEmail(email);
		} catch (error: any) {
			throw error;
		}
	}
}
