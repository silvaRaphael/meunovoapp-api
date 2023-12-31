import { randomUUID } from "node:crypto";
import { hashSync } from "bcrypt";

export type Roles = "master" | "admin" | "client";

export interface IUser {
	id?: string;
	name?: string;
	email: string;
	password?: string;
	role: Roles;
	avatar?: string;
	client_id?: string;
	is_manager?: boolean;
	token?: string;
	ws_token?: string;
	invited_at?: Date;
	activated_at?: Date;
}

export class User {
	id: string;
	name: string | null;
	email: string;
	password: string | null;
	role: Roles;
	avatar: string | null;
	client_id?: string | null;
	is_manager: boolean;
	token: string | null;
	ws_token: string | null;
	invited_at?: Date;
	activated_at?: Date;

	constructor(
		{
			id,
			name,
			email,
			password,
			role,
			avatar,
			client_id,
			is_manager,
			token,
			ws_token,
			invited_at,
			activated_at,
		}: IUser,
		autoHashPassword: boolean = true,
	) {
		this.id = id || randomUUID();
		this.name = name || null;
		this.email = email;
		this.password = password
			? autoHashPassword
				? hashSync(password, 8)
				: password
			: null;
		this.role = role;
		this.avatar = avatar || null;
		this.client_id = client_id;
		this.is_manager = is_manager || false;
		this.token = token || null;
		this.ws_token = ws_token || null;
		this.invited_at = invited_at;
		this.activated_at = activated_at;
	}
}
