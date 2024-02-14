import { Client } from "../../../domain/client";
import { CreateClientSchema } from "../../adapters/client";
import { ClientRepository } from "../../repositories/client-repository";

export class CreateClientUseCase {
	constructor(private clientRepository: ClientRepository) {}

	async execute(client: CreateClientSchema): Promise<{ id: string }> {
		try {
			const clientToCreate = new Client(client);

			await this.clientRepository.create(clientToCreate);

			return { id: clientToCreate.id };
		} catch (error: any) {
			throw error;
		}
	}
}
