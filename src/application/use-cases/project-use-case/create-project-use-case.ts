import { Project } from "../../../domain/project";
import { CreateProjectSchema } from "../../adapters/project";
import { ProjectRepository } from "../../repositories/project-repository";

export class CreateProjectUseCase {
	constructor(private projectRepository: ProjectRepository) {}

	async execute(project: CreateProjectSchema): Promise<{
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
			const projectToCreate = new Project(project);

			return await this.projectRepository.create(projectToCreate);
		} catch (error: any) {
			throw error;
		}
	}
}
