import { User } from "../../domain/user";

export interface UserRepository {
	getAll(): Promise<User[]>;
	getOne(id: string): Promise<User | null>;
	getOneByEmail(email: string): Promise<User | null>;
}
