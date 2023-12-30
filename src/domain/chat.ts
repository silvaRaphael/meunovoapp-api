import { randomUUID } from "node:crypto";
import { User } from "./user";
import { Message } from "./message";

export interface IChat {
	id?: string;
	participants_id: string[];
}

export class Chat {
	id: string;
	participants_id: string[];
	user?: User;
	participant?: User;
	last_message?: Message;

	constructor({ id, participants_id }: IChat) {
		this.id = id || randomUUID();
		this.participants_id = participants_id;
	}
}
