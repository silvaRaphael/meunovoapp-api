import { Request, Response } from "express";
import { SignInUseCase } from "@use-cases/auth-use-case/sign-in-use-case";
import { SignOutUseCase } from "@use-cases/auth-use-case/sign-out-use-case";
import { signInSchema, signOutSchema } from "@adapters/auth";

export class AuthController {
	constructor(
		private signInUseCase: SignInUseCase,
		private signOutUseCase: SignOutUseCase,
	) {}

	async signIn(req: Request, res: Response) {
		try {
			const { email, password } = signInSchema.parse(req.body);

			const response = await this.signInUseCase.execute({
				email,
				password,
			});

			res.status(200).send(response);
		} catch (error: any) {
			res.status(400).send({ error: error.message });
		}
	}

	async signOut(req: Request, res: Response) {
		try {
			const { token } = signOutSchema.parse(req.body);

			await this.signOutUseCase.execute(token);

			res.status(200).send();
		} catch (error: any) {
			res.status(400).send({ error: error.message });
		}
	}
}
