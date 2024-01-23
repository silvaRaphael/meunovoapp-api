import { randomUUID } from "node:crypto";

export interface INote {
	id?: string;
	title: string;
	content?: string;
	markers?: string[];
}

export class Note {
	id?: string;
	title: string;
	content?: string;
	markers?: string[];

	constructor({ id, title, content, markers }: INote) {
		this.id = id || randomUUID();
		this.title = title;
		this.content = content;
		this.markers = markers;
	}
}
