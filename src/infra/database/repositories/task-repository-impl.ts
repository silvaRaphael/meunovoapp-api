import {
	TaskFilter,
	TaskRepository,
} from "../../../application/repositories/task-repository";
import { Task } from "../../../domain/task";
import { PrismaType } from "../prisma";

export class TaskRepositoryImpl implements TaskRepository {
	constructor(private database: PrismaType) {}

	async create(task: Task): Promise<{
		projectName: string;
		users: {
			id: string;
			name: string | null;
			email: string;
			userPreferences: {
				email_notification: boolean;
				console_notification: boolean;
			} | null;
		}[];
	}> {
		try {
			const response = await this.database.task.create({
				data: {
					...task,
				},
				select: {
					project: {
						select: {
							name: true,
							client: {
								select: {
									users: {
										select: {
											id: true,
											name: true,
											email: true,
											userPreferences: {
												select: {
													console_notification: true,
													email_notification: true,
												},
											},
										},
										where: {
											password: { not: null },
										},
									},
								},
							},
						},
					},
				},
			});

			return {
				projectName: response.project?.name || "",
				users: response.project?.client?.users ?? [],
			};
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async update(task: Task): Promise<{
		projectName: string;
		users: {
			id: string;
			name: string | null;
			email: string;
			userPreferences: {
				email_notification: boolean;
				console_notification: boolean;
			} | null;
		}[];
	}> {
		try {
			const response = await this.database.task.update({
				data: {
					...task,
				},
				where: {
					id: task.id,
				},
				select: {
					project: {
						select: {
							name: true,
							client: {
								select: {
									users: {
										select: {
											id: true,
											name: true,
											email: true,
											userPreferences: {
												select: {
													console_notification: true,
													email_notification: true,
												},
											},
										},
										where: {
											password: { not: null },
										},
									},
								},
							},
						},
					},
				},
			});

			return {
				projectName: response.project?.name || "",
				users: response.project?.client?.users ?? [],
			};
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
					startDate: true,
					endDate: true,
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
						status: { not: "cancelled" },
					},
					status: { not: "cancelled" },
				},
				orderBy: {
					startDate: "asc",
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
					status: { not: "cancelled" },
				},
				select: {
					id: true,
					name: true,
					status: true,
					description: true,
					startDate: true,
					project: {
						select: {
							id: true,
							due: true,
							status: true,
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
