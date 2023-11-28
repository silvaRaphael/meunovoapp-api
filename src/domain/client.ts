import { randomUUID } from "node:crypto";

export interface IClient {
	id?: string;
	company: string;
	logotipo?: string;
}

export class Client {
	id: string;
	company: string;
	logotipo: string | null;

	constructor({ id, company, logotipo }: IClient) {
		this.id = id || randomUUID();
		this.company = company;
		this.logotipo = logotipo || null;
	}
}
