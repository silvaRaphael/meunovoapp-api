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
			const response = await this.database.email.findMany({
				where: {
					name: {
						contains: filters?.name,
					},
					OR: [
						{
							from: {
								contains: filters?.from,
							},
							to: {
								has: filters?.from,
							},
						},
						{
							to: {
								has: filters?.to,
							},
							from: {
								contains: filters?.to,
							},
						},
					],
					subject: {
						contains: filters?.subject,
					},
					html: {
						contains: filters?.html,
					},
					created_at: {
						in: filters?.created_at,
					},
				},
				take: filters?.limit,
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
