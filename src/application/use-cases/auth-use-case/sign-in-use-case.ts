import { randomUUID } from "node:crypto";
import { compareSync } from "bcryptjs";
import { AuthRepository } from "@repositories/auth-repository";
import { UserRepository } from "@repositories/user-repository";
import { SignInCredentials } from "@dtos/auth-credentials";
import { User } from "@domain/user";

export class SignInUseCase {
	constructor(
		private authRepository: AuthRepository,
		private userRepository: UserRepository,
	) {}

	async execute({ email, password }: SignInCredentials): Promise<User> {
		try {
			const response = await this.userRepository.getOneByEmail(email);

			if (!response) throw new Error("E-mail não encontrado.");

			if (!compareSync(password, response.password))
				throw new Error("Senha incorreta.");

			const token = randomUUID();

			await this.authRepository.signIn({
				id: response.id,
				token,
			});

			(response as any).password = undefined;

			return {
				...response,
				token,
			} as User;
		} catch (error: any) {
			throw error;
		}
	}
}
