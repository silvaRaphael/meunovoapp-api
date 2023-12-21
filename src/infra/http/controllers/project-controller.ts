import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { CreateProjectUseCase } from "../../../application/use-cases/project-use-case/create-project-use-case";
import { UpdateProjectUseCase } from "../../../application/use-cases/project-use-case/update-project-use-case";
import { GetAllProjectsUseCase } from "../../../application/use-cases/project-use-case/get-all-projects-use-case";
import { GetProjectUseCase } from "../../../application/use-cases/project-use-case/get-project-use-case";
import {
	createProjectSchema,
	updateProjectSchema,
} from "../../../application/adapters/project";
import { AuthRequest } from "../../config/auth-request";
import { CreateNotificationUseCase } from "../../../application/use-cases/notification-use-case/create-notification-use-case";

export class ProjectController {
	constructor(
		private createProjectUseCase: CreateProjectUseCase,
		private updateProjectUseCase: UpdateProjectUseCase,
		private getAllProjectsUseCase: GetAllProjectsUseCase,
		private getProjectUseCase: GetProjectUseCase,

		private createNotificationUseCase: CreateNotificationUseCase,
	) {}

	async createProject(req: Request, res: Response) {
		try {
			const { client_id, name, description, status, due } =
				createProjectSchema.parse(req.body);

			const response = await this.createProjectUseCase.execute({
				client_id,
				name,
				description,
				status,
				due,
			});

			response.forEach(({ userId }) => {
				this.createNotificationUseCase.execute({
					user_id: userId,
					title: "Projeto",
					description: `Projeto "${name}" foi criado!`,
					type: "pending",
				});
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async updateProject(req: Request, res: Response) {
		try {
			const { id } = updateProjectSchema.parse(req.params);

			const { client_id, name, description, status, due } =
				createProjectSchema.parse(req.body);

			const response = await this.updateProjectUseCase.execute({
				id,
				client_id,
				name,
				description,
				status,
				due,
			});

			if (["in progress", "completed"].includes(status as any)) {
				response.forEach(({ userId }) => {
					this.createNotificationUseCase.execute({
						user_id: userId,
						title: "Projeto",
						type: status === "in progress" ? "started" : "done",
						description: `Projeto "${name}" foi ${
							status === "in progress" ? "iniciado" : "finalizado"
						}!`,
						link: `/projetos/${id}`,
					});
				});
			}

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getAllProjects(req: Request, res: Response) {
		try {
			const { clientId } = req as AuthRequest;

			const response = await this.getAllProjectsUseCase.execute({
				client_id: clientId,
			});

			res.status(200).json(response);
		} catch (error: any) {
			console.error(error);
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getProject(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const response = await this.getProjectUseCase.execute(id);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async canUpdate(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const response = await this.getProjectUseCase.execute(id);

			if (!response) throw new Error("Projeto não existe.");

			if (["cancelled", "completed"].includes(response.status))
				throw new Error("Projeto já finalizado.");

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}
}
