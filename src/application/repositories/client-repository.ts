import { Client } from "../../domain/client";

export interface ClientRepository {
	create(client: Client): Promise<void>;
	update(client: Client): Promise<void>;
	getAll(): Promise<Client[]>;
	getOne(id: string): Promise<Client | null>;
}
