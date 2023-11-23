import { Email } from "../../../domain/email";
import {
	EmailFilter,
	EmailRepository,
} from "../../repositories/email-repository";

export class GetAllEmailsUseCase {
	constructor(private emailRepository: EmailRepository) {}

	async execute(filters?: EmailFilter): Promise<Email[]> {
		try {
			return await this.emailRepository.getAll(filters);
		} catch (error: any) {
			throw error;
		}
	}
}
