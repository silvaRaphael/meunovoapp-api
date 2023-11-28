import { User } from "../../domain/user";

export interface UserRepository {
	create(user: User): Promise<void>;
	update(user: User): Promise<void>;
	getAll(): Promise<User[]>;
	getOne(id: string): Promise<User | null>;
	getOneByEmail(email: string): Promise<User | null>;
}
