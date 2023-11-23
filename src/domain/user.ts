import { randomUUID } from "node:crypto";
import { hashSync } from "bcrypt";

export type Roles = "admin" | "client";

export interface IUser {
	id?: string;
	name: string;
	email: string;
	password: string;
	role: Roles;
	token?: string;
}

export class User {
	id: string;
	name: string;
	email: string;
	password: string;
	role: Roles;
	token: string | null;

	constructor({ id, name, email, password, role, token }: IUser) {
		this.id = id || randomUUID();
		this.name = name;
		this.email = email;
		this.password = hashSync(password, 8);
		this.role = role;
		this.token = token || null;
	}
}
