import { Email } from "../../../domain/email";
import { SendEmailSchema } from "../../adapters/email";
import { EmailRepository } from "../../repositories/email-repository";

export class SendEmailUseCase {
	constructor(private emailRepository: EmailRepository) {}

	async execute(email: SendEmailSchema): Promise<void> {
		try {
			const emailToSend = new Email(email);

			const response = await this.emailRepository.send(emailToSend);

			if (!response) throw Error;

			if (!email.no_save) this.emailRepository.create(emailToSend);
		} catch (error: any) {
			throw error;
		}
	}
}
