import { randomUUID } from "node:crypto";

export interface IClient {
	id?: string;
	company: string;
	cpf?: string;
	cnpj?: string;
	logotipo?: string;
}

export class Client {
	id: string;
	company: string;
	cpf: string | null;
	cnpj: string | null;
	logotipo: string | null;

	constructor({ id, company, cpf, cnpj, logotipo }: IClient) {
		this.id = id || randomUUID();
		this.company = company;
		this.cpf = cpf || null;
		this.cnpj = cnpj || null;
		this.logotipo = logotipo || null;
	}
}
