import { randomUUID } from "node:crypto";
import { User } from "./user";

export type MessageLabel = "support" | "meeting" | "important";

export const messageLabelTypes = ["support", "meeting", "important"] as const;

export interface MessageUser {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	is_manager: boolean;
	ws_token?: string;
}

export interface IMessage {
	id?: string;
	chat_id: string;
	user_id: string;
	text: string;
	date?: Date;
	read?: boolean;
	labels?: MessageLabel[];
}

export class Message {
	id: string;
	chat_id: string;
	user_id: string;
	user?: User;
	participant?: User;
	text: string;
	date: Date;
	read: boolean;
	labels?: MessageLabel[];

	constructor({ id, chat_id, user_id, text, date, read, labels }: IMessage) {
		this.id = id || randomUUID();
		this.chat_id = chat_id;
		this.user_id = user_id;
		this.text = text;
		this.date = date || new Date();
		this.read = read || false;
		this.labels = labels ?? [];
	}
}
