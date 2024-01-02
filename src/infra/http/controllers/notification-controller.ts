import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { GetAllNotificationsUseCase } from "../../../application/use-cases/notification-use-case/get-all-notifications-use-case";
import { userIdSchema } from "../../../application/adapters/user";
import { AuthRequest } from "../../config/auth-request";

export class NotificationController {
	constructor(
		private getAllNotificationsUseCase: GetAllNotificationsUseCase,
	) {}

	async getAllNotifications(req: Request, res: Response) {
		try {
			const { userId } = userIdSchema.parse(req as AuthRequest);

			const response = await this.getAllNotificationsUseCase.execute(
				userId,
			);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}
}
