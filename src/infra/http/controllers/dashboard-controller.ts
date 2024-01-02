import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { GetAllProjectsUseCase } from "../../../application/use-cases/project-use-case/get-all-projects-use-case";
import { AuthRequest } from "../../config/auth-request";
import { GetAllUsersUseCase } from "../../../application/use-cases/user-use-case/get-all-users-use-case";
import { Task } from "../../../domain/task";

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
					(item as any).tasks?.filter(
						(item: Task) => !["cancelled"].includes(item.status),
					).length || 0;
				const doneTasks =
					(item as any).tasks?.filter((item: Task) =>
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
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async getUsers(req: Request, res: Response) {
		try {
			const { clientId, userRole } = req as AuthRequest;

			const filter = {};

			if (userRole != "master") (filter as any).client_id = clientId;

			const response = await this.getAllUsersUseCase.execute(filter);

			const users = response.map(
				({ name, email, avatar, activated_at, is_manager }) => {
					return {
						name,
						email,
						avatar,
						activated_at,
						is_manager,
					};
				},
			);

			res.status(200).json(users);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}
}
