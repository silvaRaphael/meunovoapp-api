import { Project } from "../../../domain/project";
import {
	CreateProjectSchema,
	UpdateProjectSchema,
} from "../../adapters/project";
import { ProjectRepository } from "../../repositories/project-repository";

export class UpdateProjectUseCase {
	constructor(private projectRepository: ProjectRepository) {}

	async execute(project: UpdateProjectSchema & CreateProjectSchema): Promise<{
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
			const projectToUpdate = new Project(project);

			return await this.projectRepository.update(projectToUpdate);
		} catch (error: any) {
			throw error;
		}
	}
}
