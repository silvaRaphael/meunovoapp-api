import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { AuthRequest } from "../../config/auth-request";
import { preferencesUserSchema } from "../../../application/adapters/preferences";
import { UpdateUserPreferencesUseCase } from "../../../application/use-cases/user-preferences-use-case/update-user-preferences-use-case";
import { userIdSchema } from "../../../application/adapters/user";
import { GetUserPreferencesUseCase } from "../../../application/use-cases/user-preferences-use-case/get-user-preferences-use-case";

export class UserPrefenrecesController {
	constructor(
		private updateUserPreferencesUseCase: UpdateUserPreferencesUseCase,
		private getUserPreferencesUseCase: GetUserPreferencesUseCase,
	) {}

	async getUserPreferences(req: Request, res: Response) {
		try {
			const { userId } = userIdSchema.parse(req as AuthRequest);

			const response = await this.getUserPreferencesUseCase.execute(
				userId,
			);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async updateUserPreferences(req: Request, res: Response) {
		try {
			const { userId } = userIdSchema.parse(req as AuthRequest);
			const { email_notification, console_notification } =
				preferencesUserSchema.parse(req.body);

			await this.updateUserPreferencesUseCase.execute({
				user_id: userId,
				email_notification,
				console_notification,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}
}
