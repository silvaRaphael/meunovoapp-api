import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { CreateTaskUseCase } from "../../../application/use-cases/task-use-case/create-task-use-case";
import { UpdateTaskUseCase } from "../../../application/use-cases/task-use-case/update-task-use-case";
import { GetAllTasksUseCase } from "../../../application/use-cases/task-use-case/get-all-tasks-use-case";
import { GetTaskUseCase } from "../../../application/use-cases/task-use-case/get-task-use-case";
import {
	createTaskSchema,
	updateTaskSchema,
} from "../../../application/adapters/task";
import { AuthRequest } from "../../config/auth-request";
import { CreateNotificationUseCase } from "../../../application/use-cases/notification-use-case/create-notification-use-case";

export class TaskController {
	constructor(
		private createTaskUseCase: CreateTaskUseCase,
		private updateTaskUseCase: UpdateTaskUseCase,
		private getAllTasksUseCase: GetAllTasksUseCase,
		private getTaskUseCase: GetTaskUseCase,

		private createNotificationUseCase: CreateNotificationUseCase,
	) {}

	async createTask(req: Request, res: Response) {
		try {
			const { project_id, name, description, status } =
				createTaskSchema.parse(req.body);

			const response = await this.createTaskUseCase.execute({
				project_id,
				name,
				description,
				status,
			});

			response.forEach(({ userId }) => {
				this.createNotificationUseCase.execute({
					user_id: userId,
					title: "Tarefa",
					type: "pending",
					description: `Tarefa "${name}" foi criada!`,
				});
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async updateTask(req: Request, res: Response) {
		try {
			const { id } = updateTaskSchema.parse(req.params);

			const { project_id, name, description, status, startDate } =
				createTaskSchema.parse(req.body);

			const response = await this.updateTaskUseCase.execute({
				id,
				project_id,
				name,
				description,
				status,
				startDate,
			});

			if (["in progress", "completed"].includes(status as any)) {
				response.forEach(({ userId }) => {
					this.createNotificationUseCase.execute({
						user_id: userId,
						title: "Tarefa",
						type: status === "in progress" ? "started" : "done",
						description: `Tarefa "${name}" foi ${
							status === "in progress" ? "iniciada" : "finalizada"
						}!`,
						link: `/tarefas/${id}`,
					});
				});
			}

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getAllTasks(req: Request, res: Response) {
		try {
			const { clientId } = req as AuthRequest;

			const response = await this.getAllTasksUseCase.execute({
				client_id: clientId,
			});

			res.status(200).json(response);
		} catch (error: any) {
			console.error(error);
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getTask(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const response = await this.getTaskUseCase.execute(id);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async canUpdate(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const response = await this.getTaskUseCase.execute(id);

			if (!response) throw new Error("Tarefa não existe.");

			if (["cancelled", "completed"].includes(response.status))
				throw new Error("Tarefa já finalizada.");

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}
}
