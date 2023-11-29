import { Project } from "../../../domain/project";
import { CreateProjectSchema } from "../../adapters/project";
import { ProjectRepository } from "../../repositories/project-repository";

export class CreateProjectUseCase {
	constructor(private projectRepository: ProjectRepository) {}

	async execute(project: CreateProjectSchema): Promise<void> {
		try {
			const projectToCreate = new Project(project);

			await this.projectRepository.create(projectToCreate);
		} catch (error: any) {
			throw error;
		}
	}
}
