import { Email } from "@domain/email";

export interface EmailRepository {
	getAll(): Promise<Email[]>;
	getOne(id: string): Promise<Email | null>;
}
