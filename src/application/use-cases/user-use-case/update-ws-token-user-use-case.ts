import { UserRepository } from "../../repositories/user-repository";

export class UpdateUserWSTokenUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute({
		user_id,
		ws_token,
	}: {
		user_id: string;
		ws_token: string | null;
	}): Promise<{ ws_token?: string }> {
		try {
			return await this.userRepository.updateWSToken({
				user_id,
				ws_token,
			});
		} catch (error: any) {
			throw error;
		}
	}
}
