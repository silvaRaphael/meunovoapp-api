import { randomUUID } from "node:crypto";
import { hashSync } from "bcrypt";

export type Roles = "master" | "admin" | "client";

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

	constructor(
		{ id, name, email, password, role, token }: IUser,
		autoHashPassword: boolean = true,
	) {
		this.id = id || randomUUID();
		this.name = name;
		this.email = email;
		this.password = autoHashPassword ? hashSync(password, 8) : password;
		this.role = role;
		this.token = token || null;
	}
}
