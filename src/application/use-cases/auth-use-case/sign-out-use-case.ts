import { AuthRepository } from "@repositories/auth-repository";

export class SignOutUseCase {
	constructor(private authRepository: AuthRepository) {}

	async execute(token: string): Promise<void> {
		try {
			await this.authRepository.signOut(token);
		} catch (error: any) {
			throw error;
		}
	}
}
