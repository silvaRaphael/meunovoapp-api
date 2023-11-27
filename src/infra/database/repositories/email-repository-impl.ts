import {
	EmailFilter,
	EmailRepository,
} from "../../../application/repositories/email-repository";
import { Email } from "../../../domain/email";
import { MailSender } from "../../providers/nodemailer";
import { PrismaType } from "../prisma";

export class EmailRepositoryImpl implements EmailRepository {
	constructor(private database: PrismaType, private mailSender: MailSender) {}

	async send(email: Email): Promise<{ id: string }> {
		try {
			const response = await this.mailSender.sendMail({
				from: email.from,
				to: email.to,
				bcc: email.from,
				subject: email.subject,
				html: email.html,
			});

			if (!response) throw Error;

			return { id: response.messageId };
		} catch (error: any) {
			throw error;
		}
	}

	async create(email: Email): Promise<void> {
		try {
			const response = await this.database.email.create({
				data: {
					...email,
				},
			});

			if (!response) throw Error;
		} catch (error: any) {
			console.error(error);
			throw new Error("DB Error.");
		}
	}

	async update(id: string): Promise<void> {
		try {
			await this.database.email.update({
				where: {
					id,
				},
				data: {
					has_reply: true,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getAll(filters?: EmailFilter): Promise<Email[]> {
		try {
			let filter: any = {};
			filter.where = {
				replyed: undefined || null,
			};

			if (filters) {
				const { name, to, from, subject, html, created_at, limit } =
					filters;
				const OR: any = [];

				if (name) filter.where.name = { contains: name };
				if (to) OR.push({ to: { has: to } });
				if (from) OR.push({ from: { in: from } });
				if (to || from) filter.where.OR = OR;
				if (subject) filter.where.subject = { contains: subject };
				if (html) filter.where.html = { contains: html };
				if (created_at) filter.where.created_at = created_at;
				if (limit) filter.take = limit;
			}

			const response = await this.database.email.findMany({
				...filter,
				orderBy: {
					created_at: "desc",
				},
			});

			if (!response) return [];

			return response as unknown as Email[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getOne(id: string): Promise<Email | null> {
		try {
			const response = await this.database.email.findFirst({
				where: {
					id,
				},
			});

			if (!response) return null;

			return response as unknown as Email;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
