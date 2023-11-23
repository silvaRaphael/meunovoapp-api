import { Request, Response } from "express";
import { emailSchema } from "../../../application/adapters/email";
import { SendEmailUseCase } from "../../../application/use-cases/email-use-case/send-email-use-case";
import { HandleError } from "../utils/handle-error";
import { GetAllEmailsUseCase } from "../../../application/use-cases/email-use-case/get-all-emails-use-case";
import { AuthRequest } from "../../config/auth-request";
import { GetEmailUseCase } from "../../../application/use-cases/email-use-case/get-email-use-case";

export class EmailController {
	constructor(
		private sendEmailUseCase: SendEmailUseCase,
		private getAllEmailsUseCase: GetAllEmailsUseCase,
		private getEmailUseCase: GetEmailUseCase,
	) {}

	async sendEmail(req: Request, res: Response) {
		try {
			const { name, from, to, subject, html } = emailSchema.parse(
				req.body,
			);

			await this.sendEmailUseCase.execute({
				name,
				from,
				to,
				subject,
				html,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(400).send({ error: HandleError(error) });
		}
	}

	async getAllEmails(req: Request, res: Response) {
		try {
			const { userEmail } = req as AuthRequest;

			const filter = userEmail
				? {
						from: [userEmail],
						to: userEmail,
				  }
				: {};

			const response = await this.getAllEmailsUseCase.execute(filter);

			res.status(200).json(response);
		} catch (error: any) {
			console.error(error);
			res.status(400).send({ error: HandleError(error) });
		}
	}

	async getEmail(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const response = await this.getEmailUseCase.execute(id);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(400).send({ error: HandleError(error) });
		}
	}
}
