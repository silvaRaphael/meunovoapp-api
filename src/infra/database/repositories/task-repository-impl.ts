import {
	TaskFilter,
	TaskRepository,
} from "../../../application/repositories/task-repository";
import { Task } from "../../../domain/task";
import { PrismaType } from "../prisma";

export class TaskRepositoryImpl implements TaskRepository {
	constructor(private database: PrismaType) {}

	async create(task: Task): Promise<void> {
		try {
			await this.database.task.create({
				data: {
					...task,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async update(task: Task): Promise<void> {
		try {
			await this.database.task.update({
				data: {
					...task,
				},
				where: {
					id: task.id,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getAll(filters?: TaskFilter): Promise<Task[]> {
		try {
			const response = await this.database.task.findMany({
				select: {
					id: true,
					name: true,
					description: true,
					status: true,
					project: {
						include: {
							client: {
								select: {
									id: true,
									company: true,
									logotipo: true,
								},
							},
						},
					},
				},
				where: {
					project: {
						client_id: filters?.client_id,
					},
				},
				orderBy: {
					project: {
						due: "asc",
					},
				},
			});

			if (!response) return [];

			return response as unknown as Task[];
		} catch (error: any) {
			console.error(error);
			throw new Error("DB Error.");
		}
	}

	async getOne(id: string): Promise<Task | null> {
		try {
			const response = await this.database.task.findFirst({
				where: {
					id,
				},
				select: {
					id: true,
					name: true,
					status: true,
					description: true,
					project: {
						select: {
							id: true,
						},
					},
				},
			});

			if (!response) return null;

			return response as unknown as Task;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
