import { randomUUID } from "node:crypto";

export type NotificationType = "pending" | "error" | "started" | "done";

export interface INotification {
	id?: string;
	user_id: string;
	type: NotificationType;
	title: string;
	description?: string;
	read: boolean;
	created_at?: Date;
}

export class Notification {
	id: string;
	user_id: string;
	type: NotificationType;
	title: string;
	description: string | null;
	read: boolean;
	created_at: Date;

	constructor({
		id,
		user_id,
		type,
		title,
		description,
		read,
		created_at,
	}: INotification) {
		this.id = id || randomUUID();
		this.user_id = user_id;
		this.type = type;
		this.title = title;
		this.description = description || null;
		this.read = read || false;
		this.created_at = created_at || new Date();
	}
}
