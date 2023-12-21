import { Project } from "../../../domain/project";
import {
	CreateProjectSchema,
	UpdateProjectSchema,
} from "../../adapters/project";
import { ProjectRepository } from "../../repositories/project-repository";

export class UpdateProjectUseCase {
	constructor(private projectRepository: ProjectRepository) {}

	async execute(
		project: UpdateProjectSchema & CreateProjectSchema,
	): Promise<{ userId: string }[]> {
		try {
			const projectToUpdate = new Project(project);

			return await this.projectRepository.update(projectToUpdate);
		} catch (error: any) {
			throw error;
		}
	}
}
