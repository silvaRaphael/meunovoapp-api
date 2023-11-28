import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { CreateUserUseCase } from "../../../application/use-cases/user-use-case/create-user-use-case";
import { UpdateUserUseCase } from "../../../application/use-cases/user-use-case/update-user-use-case";
import { GetAllUsersUseCase } from "../../../application/use-cases/user-use-case/get-all-users-use-case";
import { GetUserUseCase } from "../../../application/use-cases/user-use-case/get-user-use-case";
import {
	createUserSchema,
	updateUserSchema,
} from "../../../application/adapters/user";

export class UserController {
	constructor(
		private createUserUseCase: CreateUserUseCase,
		private updateUserUseCase: UpdateUserUseCase,
		private getAllUsersUseCase: GetAllUsersUseCase,
		private getUserUseCase: GetUserUseCase,
	) {}

	async createUser(req: Request, res: Response) {
		try {
			const { email, client_id } = createUserSchema.parse(req.body);

			const response = await this.createUserUseCase.execute({
				email,
				client_id,
			});

			res.status(200).json({
				id: response.id,
			});
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async updateUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { name, email, password } = updateUserSchema.parse(req.body);

			await this.updateUserUseCase.execute({
				id,
				name,
				email,
				password,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getAllUsers(req: Request, res: Response) {
		try {
			const response = await this.getAllUsersUseCase.execute();

			res.status(200).json(response);
		} catch (error: any) {
			console.error(error);
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getUser(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const response = await this.getUserUseCase.execute(id);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}
}
