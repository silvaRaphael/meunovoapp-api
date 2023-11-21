import { PrismaType } from "@db/prisma";
import { Email } from "@domain/email";
import { EmailRepository } from "@repositories/email-repository";

export class EmailRepositoryImpl implements EmailRepository {
	constructor(private database: PrismaType) {}

	async getAll(): Promise<Email[]> {
		try {
			const response = await this.database.email.findMany({});

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
