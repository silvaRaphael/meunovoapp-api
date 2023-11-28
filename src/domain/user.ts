import { randomUUID } from "node:crypto";
import { hashSync } from "bcrypt";

export type Roles = "master" | "admin" | "client";

export interface IUser {
	id?: string;
	name: string;
	email: string;
	password: string;
	role: Roles;
	client_id?: string;
	token?: string;
}

export class User {
	id: string;
	name: string;
	email: string;
	password: string;
	role: Roles;
	client_id: string | null;
	token: string | null;

	constructor(
		{ id, name, email, password, role, client_id, token }: IUser,
		autoHashPassword: boolean = true,
	) {
		this.id = id || randomUUID();
		this.name = name;
		this.email = email;
		this.password = autoHashPassword ? hashSync(password, 8) : password;
		this.role = role;
		this.client_id = client_id || null;
		this.token = token || null;
	}
}
