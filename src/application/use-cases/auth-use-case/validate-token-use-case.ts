import { User } from "@prisma/client";
import { AuthRepository } from "../../repositories/auth-repository";

export class ValidateTokenUseCase {
	constructor(private authRepository: AuthRepository) {}

	async execute(token: string): Promise<User | null> {
		try {
			return await this.authRepository.validateToken(token);
		} catch (error: any) {
			throw error;
		}
	}
}
