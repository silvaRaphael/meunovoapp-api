import { Client } from "../../../domain/client";
import { ClientRepository } from "../../repositories/client-repository";

export class GetClientUseCase {
	constructor(private clientRepository: ClientRepository) {}

	async execute(id: string): Promise<Client | null> {
		try {
			return await this.clientRepository.getOne(id);
		} catch (error: any) {
			throw error;
		}
	}
}
