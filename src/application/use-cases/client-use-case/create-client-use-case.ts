import { Client } from "../../../domain/client";
import { CreateClientSchema } from "../../adapters/client";
import { ClientRepository } from "../../repositories/client-repository";

export class CreateClientUseCase {
	constructor(private clientRepository: ClientRepository) {}

	async execute(client: CreateClientSchema): Promise<void> {
		try {
			const clientToCreate = new Client(client);

			await this.clientRepository.create(clientToCreate);
		} catch (error: any) {
			throw error;
		}
	}
}
