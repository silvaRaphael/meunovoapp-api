import { randomUUID } from "node:crypto";

export type ChatLabel = "chat" | "support" | "meeting" | "important";

export const chatLabelTypes = [
	"chat",
	"support",
	"meeting",
	"important",
] as const;

export interface IChat {
	id?: string;
	user_id: string;
	receiver_id: string;
	text: string;
	date?: Date;
	read?: boolean;
	labels?: ChatLabel[];
}

export class Chat {
	id: string;
	user_id: string;
	receiver_id: string;
	text: string;
	date: Date;
	read: boolean;
	labels?: ChatLabel[];

	constructor({ id, user_id, receiver_id, text, date, read, labels }: IChat) {
		this.id = id || randomUUID();
		this.user_id = user_id;
		this.receiver_id = receiver_id;
		this.text = text;
		this.date = date || new Date();
		this.read = read || false;
		this.labels = labels ?? [];
	}
}
