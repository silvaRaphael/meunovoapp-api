import { User } from "../../../domain/user";
import { UserFilter, UserRepository } from "../../repositories/user-repository";

export class GetAllUsersUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(filters?: UserFilter): Promise<User[]> {
		try {
			return await this.userRepository.getAll(filters);
		} catch (error: any) {
			throw error;
		}
	}
}
