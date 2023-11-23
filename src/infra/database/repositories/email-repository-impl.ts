import {
	EmailFilter,
	EmailRepository,
} from "../../../application/repositories/email-repository";
import { Email } from "../../../domain/email";
import { ResendType } from "../../providers/resend";
import { PrismaType } from "../prisma";

export class EmailRepositoryImpl implements EmailRepository {
	constructor(private database: PrismaType, private mailSender: ResendType) {}

	async send(email: Email): Promise<{ id: string }> {
		try {
			const response = (await this.mailSender.emails.send({
				from: email.from,
				to: email.to,
				subject: email.subject,
				html: email.html,
			})) as { data: { id: string }; error?: any };

			if (!response || response.error)
				throw !response ? Error : new Error(response.error.message);

			return { id: response.data.id };
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
			throw new Error("DB Error.");
		}
	}

	async getAll(filters?: EmailFilter): Promise<Email[]> {
		try {
			let filter: any = {};

			if (filters) {
				const { name, to, from, subject, html, created_at, limit } =
					filters;
				const OR: any = [];

				if (name || to || from || subject || html || created_at)
					filter.where = {};

				if (name) filter.where.name = { contains: name };
				if (to) OR.push({ to: { has: to } });
				if (from) OR.push({ from: { in: from } });
				if (to || from) filter.where.OR = OR;
				if (subject) filter.where.subject = { contains: subject };
				if (html) filter.where.html = { contains: html };
				if (created_at) filter.where.created_at = created_at;
				if (limit) filter.take = limit;
			}

			console.log(filter);

			const response = await this.database.email.findMany(filter);

			if (!response) return [];

			return response as unknown as Email[];
		} catch (error: any) {
			console.error(error);
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
