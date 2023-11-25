import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { SignOutUseCase } from "../../../application/use-cases/auth-use-case/sign-out-use-case";
import { AuthRequest } from "../../config/auth-request";
import { SignInUseCase } from "../../../application/use-cases/auth-use-case/sign-in-use-case";
import { signInSchema, tokenSchema } from "../../../application/adapters/auth";

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

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).json({ error: HandleError(error) });
		}
	}

	async signOut(req: Request, res: Response) {
		try {
			const token = tokenSchema.parse((req as AuthRequest).token);

			await this.signOutUseCase.execute(token);

			res.status(200).send();
		} catch (error: any) {
			res.status(401).json({ error: HandleError(error) });
		}
	}
}
