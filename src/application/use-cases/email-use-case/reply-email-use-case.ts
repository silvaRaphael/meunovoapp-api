import { Email } from "../../../domain/email";
import { ReplyEmailSchema, SendEmailSchema } from "../../adapters/email";
import { EmailRepository } from "../../repositories/email-repository";

export class ReplyEmailUseCase {
	constructor(private emailRepository: EmailRepository) {}

	async execute(email: ReplyEmailSchema & SendEmailSchema): Promise<void> {
		try {
			const emailToReply = new Email(email);

			const response = await this.emailRepository.send(emailToReply);

			if (!response) throw Error;

			await Promise.all([
				this.emailRepository.create(emailToReply),
				this.emailRepository.update(email.replyed),
			]);
		} catch (error: any) {
			throw error;
		}
	}
}
