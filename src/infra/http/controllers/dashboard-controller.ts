import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { GetAllProjectsUseCase } from "../../../application/use-cases/project-use-case/get-all-projects-use-case";
import { AuthRequest } from "../../config/auth-request";
import { GetAllUsersUseCase } from "../../../application/use-cases/user-use-case/get-all-users-use-case";

export class DashboardController {
	constructor(
		private getAllProjectsUseCase: GetAllProjectsUseCase,
		private getAllUsersUseCase: GetAllUsersUseCase,
	) {}

	async getProjects(req: Request, res: Response) {
		try {
			const { clientId, userRole } = req as AuthRequest;

			const filter = {};

			if (userRole != "master") (filter as any).client_id = clientId;

			const response = await this.getAllProjectsUseCase.execute(filter);

			const projects = response.map((item) => {
				const totalTasks =
					item.tasks?.filter(
						(item) => !["cancelled"].includes(item.status),
					).length || 0;
				const doneTasks =
					item.tasks?.filter((item) =>
						["completed"].includes(item.status),
					).length || 0;

				return {
					name: item.name,
					progress:
						item.status === "completed"
							? 100
							: (doneTasks / totalTasks) * 100,
				};
			});

			res.status(200).json(projects);
		} catch (error: any) {
			console.error(error);
			res.status(401).send({ error: HandleError(error) });
		}
	}

	async getUsers(req: Request, res: Response) {
		try {
			const { clientId, userRole, userId } = req as AuthRequest;

			const filter = {};

			if (userRole != "master") (filter as any).client_id = clientId;

			const response = await this.getAllUsersUseCase.execute(filter);

			const users = response
				.filter((item) => item.id !== userId)
				.map(({ name, email, avatar, activated_at }) => {
					return {
						name,
						email,
						avatar,
						activated_at,
					};
				});

			res.status(200).json(users);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}
}
