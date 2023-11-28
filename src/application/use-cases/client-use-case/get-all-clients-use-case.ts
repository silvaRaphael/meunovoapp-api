import { Client } from "../../../domain/client";
import { ClientRepository } from "../../repositories/client-repository";

export class GetAllClientsUseCase {
	constructor(private clientRepository: ClientRepository) {}

	async execute(): Promise<Client[]> {
		try {
			return await this.clientRepository.getAll();
		} catch (error: any) {
			throw error;
		}
	}
}
