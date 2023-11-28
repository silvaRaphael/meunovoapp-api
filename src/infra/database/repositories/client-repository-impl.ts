import { ClientRepository } from "../../../application/repositories/client-repository";
import { Client } from "../../../domain/client";
import { PrismaType } from "../prisma";

export class ClientRepositoryImpl implements ClientRepository {
	constructor(private database: PrismaType) {}

	async create(client: Client): Promise<void> {
		try {
			await this.database.client.create({
				data: {
					...client,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async update(client: Client): Promise<void> {
		try {
			await this.database.client.update({
				data: {
					...client,
				},
				where: {
					id: client.id,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getAll(): Promise<Client[]> {
		try {
			const response = await this.database.client.findMany({
				select: {
					id: true,
					company: true,
					logotipo: true,
					users: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			});

			if (!response) return [];

			return response as unknown as Client[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getOne(id: string): Promise<Client | null> {
		try {
			const response = await this.database.client.findFirst({
				where: {
					id,
				},
			});

			if (!response) return null;

			return response as unknown as Client;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
