import { randomUUID } from "node:crypto";

export interface IEmail {
	id?: string;
	name: string;
	from: string;
	to: string[];
	subject: string;
	html: string;
	replyed?: string;
	has_reply?: boolean;
	created_at?: Date;
}

export class Email {
	id: string;
	name: string;
	from: string;
	to: string[];
	subject: string;
	html: string;
	replyed?: string;
	has_reply: boolean;
	created_at: Date;

	constructor({
		id,
		name,
		from,
		to,
		subject,
		html,
		replyed,
		has_reply,
		created_at,
	}: IEmail) {
		this.id = id || randomUUID();
		this.name = name;
		this.from = from;
		this.to = to;
		this.subject = subject;
		this.html = html;
		this.replyed = replyed;
		this.has_reply = has_reply || false;
		this.created_at = created_at || new Date();
	}
}
