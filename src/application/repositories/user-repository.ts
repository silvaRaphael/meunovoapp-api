import { User } from "../../domain/user";

export interface UserFilter {
	client_id?: string;
}

export interface UserRepository {
	create(user: User): Promise<void>;
	update(user: User): Promise<void>;
	updateWSToken({
		user_id,
		ws_token,
	}: {
		user_id: string;
		ws_token: string | null;
	}): Promise<{ ws_token?: string }>;
	getAll(filters?: UserFilter): Promise<User[]>;
	getOne(id: string): Promise<User | null>;
	getOneByEmail(email: string): Promise<User | null>;
	getOneByPasswordKey(key: string): Promise<User | null>;
}
