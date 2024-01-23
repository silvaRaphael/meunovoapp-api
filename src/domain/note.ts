import { randomUUID } from "node:crypto";

export interface INote {
	id?: string;
	user_id: string;
	title: string;
	content?: string;
	markers?: string[];
	created_at?: Date;
}

export class Note {
	id: string;
	user_id: string;
	title: string;
	content?: string;
	markers: string[];
	created_at: Date;

	constructor({ id, user_id, title, content, markers, created_at }: INote) {
		this.id = id || randomUUID();
		this.user_id = user_id;
		this.title = title;
		this.content = content;
		this.markers = markers || [];
		this.created_at = created_at ?? new Date();
	}
}
