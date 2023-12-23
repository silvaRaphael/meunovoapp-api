import { Request, Response } from "express";
import {
	replyBudgetMessageEmailSchema,
	replyContactMessageEmailSchema,
	replyEmailSchema,
	sendBudgetMessageEmailSchema,
	sendContactMessageEmailSchema,
	sendEmailSchema,
	sendUserInviteMessageEmailSchema,
} from "../../../application/adapters/email";
import { SendEmailUseCase } from "../../../application/use-cases/email-use-case/send-email-use-case";
import { HandleError } from "../utils/handle-error";
import { GetAllEmailsUseCase } from "../../../application/use-cases/email-use-case/get-all-emails-use-case";
import { AuthRequest } from "../../config/auth-request";
import { GetEmailUseCase } from "../../../application/use-cases/email-use-case/get-email-use-case";
import { ReplyEmailUseCase } from "../../../application/use-cases/email-use-case/reply-email-use-case";
import { replaceKeys } from "../utils/replace-keys";
import {
	ReplyBudgetTemplate,
	replyBudgetTemplate,
} from "../../templates/reply-budget-template";
import {
	ReplyMessageTemplate,
	replyMessageTemplate,
} from "../../templates/reply-message-template";
import {
	ContactMessageTemplate,
	contactMessageTemplate,
} from "../../templates/contact-message-template";
import {
	BudgetMessageTemplate,
	budgetMessageTemplate,
} from "../../templates/budget-message-template";
import {
	InviteUserMessageTemplate,
	inviteUserMessageTemplate,
} from "../../templates/invite-user-message-template";

export class EmailController {
	constructor(
		private sendEmailUseCase: SendEmailUseCase,
		private replyEmailUseCase: ReplyEmailUseCase,
		private getAllEmailsUseCase: GetAllEmailsUseCase,
		private getEmailUseCase: GetEmailUseCase,
	) {}

	async sendEmail(req: Request, res: Response) {
		try {
			const { title, name, from, to, subject, html, type, no_save } =
				sendEmailSchema.parse(req.body);

			await this.sendEmailUseCase.execute({
				title,
				name,
				from,
				to,
				subject,
				html,
				type,
				no_save,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async sendUserInviteMessageEmail(req: Request, res: Response) {
		try {
			const { from, to, subject } = sendEmailSchema.parse(req.body);
			const { userId } = sendUserInviteMessageEmailSchema.parse(req.body);

			await this.sendEmailUseCase.execute({
				from,
				to,
				subject,
				html: replaceKeys<InviteUserMessageTemplate>(
					inviteUserMessageTemplate,
					{
						"[userId]": userId,
					},
				),
				type: "user-invite",
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async sendContactMessageEmail(req: Request, res: Response) {
		try {
			const { name, from, to, subject } = sendEmailSchema.parse(req.body);
			const { email, phone, message } =
				sendContactMessageEmailSchema.parse(req.body);

			await this.sendEmailUseCase.execute({
				title: "Agradecemos pelo seu Contato",
				name,
				from,
				to,
				subject,
				html: replaceKeys<ContactMessageTemplate>(
					contactMessageTemplate,
					{
						"[name]": name || "",
						"[email]": email,
						"[phone]": phone,
						"[message]": message,
					},
				),
				type: "contact-message",
				no_save: true,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async sendBudgetMessageEmail(req: Request, res: Response) {
		try {
			const { name, from, to, subject } = sendEmailSchema.parse(req.body);
			const {
				email,
				phone,
				company,
				role,
				description,
				projectType,
				budget,
				due,
			} = sendBudgetMessageEmailSchema.parse(req.body);

			await this.sendEmailUseCase.execute({
				title: "Agradecemos pelo seu Contato",
				name,
				from,
				to,
				subject,
				html: replaceKeys<BudgetMessageTemplate>(
					budgetMessageTemplate,
					{
						"[name]": name || "",
						"[email]": email,
						"[phone]": phone,
						"[company]": company,
						"[role]": role,
						"[description]": description,
						"[projectType]": projectType,
						"[budget]": budget,
						"[due]": due,
					},
				),
				type: "budget-message",
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async replyContactMessageEmail(req: Request, res: Response) {
		try {
			const { replied } = replyEmailSchema.parse(req.body);
			const { title, name, from, to, subject } = sendEmailSchema.parse(
				req.body,
			);
			const { receivedMessage, message } =
				replyContactMessageEmailSchema.parse(req.body);

			await this.replyEmailUseCase.execute({
				title,
				name,
				from,
				to,
				subject,
				html: replaceKeys<ReplyMessageTemplate>(replyMessageTemplate, {
					"[title]": title || "",
					"[name]": name || "",
					"[receivedMessage]": receivedMessage,
					"[message]": message,
				}),
				type: "contact-reply",
				replied,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async replyBudgetMessageEmail(req: Request, res: Response) {
		try {
			const { replied } = replyEmailSchema.parse(req.body);
			const { title, name, from, to, subject } = sendEmailSchema.parse(
				req.body,
			);
			const {
				projectDetails,
				projectScope,
				projectStartDate,
				projectEndDate,
				projectPayment,
				projectBenefits,
			} = replyBudgetMessageEmailSchema.parse(req.body);

			await this.replyEmailUseCase.execute({
				title,
				name,
				from,
				to,
				subject,
				html: replaceKeys<ReplyBudgetTemplate>(replyBudgetTemplate, {
					"[title]": title || "",
					"[name]": name || "",
					"[projectDetails]": projectDetails,
					"[projectScope]": projectScope,
					"[projectStartDate]": projectStartDate,
					"[projectEndDate]": projectEndDate,
					"[projectPayment]": projectPayment,
					"[projectBenefits]": projectBenefits,
				}),
				type: "budget-reply",
				replied,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
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
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getEmail(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const response = await this.getEmailUseCase.execute(id);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}
}
