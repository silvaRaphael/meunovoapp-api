import { Client } from "../../../domain/client";
import { CreateClientSchema, UpdateClientSchema } from "../../adapters/client";
import { ClientRepository } from "../../repositories/client-repository";

export class UpdateClientUseCase {
	constructor(private clientRepository: ClientRepository) {}

	async execute(
		client: UpdateClientSchema & CreateClientSchema,
	): Promise<void> {
		try {
			const clientToUpdate = new Client(client);

			await this.clientRepository.update(clientToUpdate);
		} catch (error: any) {
			throw error;
		}
	}
}
