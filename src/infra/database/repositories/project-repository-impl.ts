import {
	ProjectFilter,
	ProjectRepository,
} from "../../../application/repositories/project-repository";
import { Project } from "../../../domain/project";
import { PrismaType } from "../prisma";

export class ProjectRepositoryImpl implements ProjectRepository {
	constructor(private database: PrismaType) {}

	async create(project: Project): Promise<void> {
		try {
			await this.database.project.create({
				data: {
					...project,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async update(project: Project): Promise<void> {
		try {
			await this.database.project.update({
				data: {
					...project,
				},
				where: {
					id: project.id,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getAll(filters?: ProjectFilter): Promise<Project[]> {
		try {
			const response = await this.database.project.findMany({
				select: {
					id: true,
					name: true,
					status: true,
					due: true,
					client: {
						select: {
							id: true,
							company: true,
							logotipo: true,
						},
					},
					tasks: {
						select: {
							status: true,
						},
						orderBy: { startDate: "asc" },
					},
				},
				where: {
					client_id: filters?.client_id,
				},
				orderBy: { due: "asc" },
			});

			if (!response) return [];

			return response as unknown as Project[];
		} catch (error: any) {
			console.error(error);
			throw new Error("DB Error.");
		}
	}

	async getOne(id: string): Promise<Project | null> {
		try {
			const response = await this.database.project.findFirst({
				where: {
					id,
				},
				select: {
					id: true,
					name: true,
					status: true,
					due: true,
					description: true,
					client: {
						select: {
							id: true,
						},
					},
					tasks: {
						select: {
							id: true,
							name: true,
							status: true,
							startDate: true,
							endDate: true,
						},
					},
				},
			});

			if (!response) return null;

			return response as unknown as Project;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
