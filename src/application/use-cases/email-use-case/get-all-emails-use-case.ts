import { Email } from "../../../domain/email";
import { EmailRepository } from "../../repositories/email-repository";

export class GetAllEmailsUseCase {
	constructor(private emailRepository: EmailRepository) {}

	async execute(): Promise<Email[]> {
		try {
			return await this.emailRepository.getAll();
		} catch (error: any) {
			throw error;
		}
	}
}
