import { ProjectRepository } from "../../../application/repositories/project-repository";
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

	async getAll(): Promise<Project[]> {
		try {
			const response = await this.database.project.findMany({
				select: {
					client: {
						select: {
							company: true,
							logotipo: true,
						},
					},
					id: true,
					name: true,
					status: true,
					due: true,
					tasks: {
						select: {
							status: true,
						},
					},
				},
			});

			if (!response) return [];

			return response as unknown as Project[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getOne(id: string): Promise<Project | null> {
		try {
			const response = await this.database.project.findFirst({
				where: {
					id,
				},
			});

			if (!response) return null;

			return response as unknown as Project;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
