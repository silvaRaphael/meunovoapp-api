import { Request, Response } from "express";
import { SignInUseCase } from "@use-cases/auth-use-case/sign-in-use-case";
import { SignOutUseCase } from "@use-cases/auth-use-case/sign-out-use-case";
import { signInSchema, tokenSchema } from "src/application/adapters/auth";
import { AuthRequest } from "@config/auth-request";
import { HandleError } from "@utils/handle-error";

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

			(response as any).id = undefined;
			(response as any).password = undefined;

			(req.session as any).user = response;

			req.session.save((error: any) => {
				if (error) throw error;
				res.status(200).json(response);
			});
		} catch (error: any) {
			res.status(400).send({ error: HandleError(error) });
		}
	}

	async signOut(req: Request, res: Response) {
		try {
			const token = tokenSchema.parse((req as AuthRequest).token);

			await this.signOutUseCase.execute(token);

			req.session.destroy(() => {});

			res.status(200).send();
		} catch (error: any) {
			res.status(400).send({ error: HandleError(error) });
		}
	}
}
