import { PrismaType } from "@db/prisma";
import { Email } from "@domain/email";
import { EmailFilter, EmailRepository } from "@repositories/email-repository";

export class EmailRepositoryImpl implements EmailRepository {
	constructor(private database: PrismaType) {}

	async getAll(filters?: EmailFilter): Promise<Email[]> {
		try {
			const response = await this.database.email.findMany({
				where: {
					name: {
						contains: filters?.name,
					},
					from: {
						contains: filters?.from,
					},
					to: {
						has: filters?.to,
					},
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
}
