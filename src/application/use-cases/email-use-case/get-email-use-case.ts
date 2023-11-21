import { Email } from "@domain/email";
import { EmailRepository } from "@repositories/email-repository";

export class GetEmailUseCase {
	constructor(private emailRepository: EmailRepository) {}

	async execute(id: string): Promise<Email | null> {
		try {
			return await this.emailRepository.getOne(id);
		} catch (error: any) {
			throw error;
		}
	}
}
