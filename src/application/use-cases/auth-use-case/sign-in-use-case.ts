import { randomUUID } from "node:crypto";
import { compareSync } from "bcrypt";
import { AuthRepository } from "../../repositories/auth-repository";
import { UserRepository } from "../../repositories/user-repository";
import { SignInSchema } from "../../adapters/auth";
import { User } from "../../../domain/user";

export class SignInUseCase {
	constructor(
		private authRepository: AuthRepository,
		private userRepository: UserRepository,
	) {}

	async execute({ email, password }: SignInSchema): Promise<User> {
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
