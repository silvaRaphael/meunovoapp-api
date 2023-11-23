import { Email } from "../../domain/email";

export interface EmailFilter {
	name?: string;
	from?: string;
	to?: string;
	subject?: string;
	html?: string;
	created_at?: Date[];
	limit?: number;
}

export interface EmailRepository {
	getAll(filters?: EmailFilter): Promise<Email[]>;
	getOne(id: string): Promise<Email | null>;
	create(email: Email): Promise<void>;
}
