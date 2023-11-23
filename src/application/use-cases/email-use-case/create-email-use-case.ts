import { Email } from "@domain/email";
import { EmailRepository } from "@repositories/email-repository";

export class CreateEmailUseCase {
	constructor(private emailRepository: EmailRepository) {}

	async execute(email: Email): Promise<void> {
		try {
			await this.emailRepository.create(email);
		} catch (error: any) {
			throw error;
		}
	}
}
