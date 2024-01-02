import { User } from "../../../domain/user";
import { UserRepository } from "../../repositories/user-repository";

export class GetUserByPasswordKeyUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(key: string): Promise<User | null> {
		try {
			return await this.userRepository.getOneByPasswordKey(key);
		} catch (error: any) {
			throw error;
		}
	}
}
