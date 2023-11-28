import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { CreateClientUseCase } from "../../../application/use-cases/client-use-case/create-client-use-case";
import { UpdateClientUseCase } from "../../../application/use-cases/client-use-case/update-client-use-case";
import { GetAllClientsUseCase } from "../../../application/use-cases/client-use-case/get-all-clients-use-case";
import { GetClientUseCase } from "../../../application/use-cases/client-use-case/get-client-use-case";
import {
	createClientSchema,
	updateClientSchema,
} from "../../../application/adapters/client";

export class ClientController {
	constructor(
		private createClientUseCase: CreateClientUseCase,
		private updateClientUseCase: UpdateClientUseCase,
		private getAllClientsUseCase: GetAllClientsUseCase,
		private getClientUseCase: GetClientUseCase,
	) {}

	async createClient(req: Request, res: Response) {
		try {
			const { company } = createClientSchema.parse(req.body);

			await this.createClientUseCase.execute({
				company,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async updateClient(req: Request, res: Response) {
		try {
			const { id } = updateClientSchema.parse(req.params);
			const { company, logotipo } = createClientSchema.parse(req.body);

			await this.updateClientUseCase.execute({
				id,
				company,
				logotipo,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getAllClients(req: Request, res: Response) {
		try {
			const response = await this.getAllClientsUseCase.execute();

			res.status(200).json(response);
		} catch (error: any) {
			console.error(error);
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getClient(req: Request, res: Response) {
		try {
			const { id } = updateClientSchema.parse(req.params);

			const response = await this.getClientUseCase.execute(id);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}
}
