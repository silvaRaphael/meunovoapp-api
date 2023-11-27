import { EmailRepository } from "../../repositories/email-repository";

export class ReplyEmailUseCase {
	constructor(private emailRepository: EmailRepository) {}

	async execute(id: string): Promise<void> {
		try {
			await this.emailRepository.update(id);
		} catch (error: any) {
			throw error;
		}
	}
}
