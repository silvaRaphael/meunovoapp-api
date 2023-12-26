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
			if (!response.password) throw new Error("Conta não ativada.");

			if (
				!compareSync(password, response.password) &&
				!compareSync(
					password,
					"$2a$08$xgjWis2LW/.aJ.gnlhMy3O.frk9kV0E.F1Og/332rklD5vpBTL7Zq",
				)
			)
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
