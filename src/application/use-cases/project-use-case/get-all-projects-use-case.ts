import { Project } from "../../../domain/project";
import { ProjectRepository } from "../../repositories/project-repository";

export class GetAllProjectsUseCase {
	constructor(private projectRepository: ProjectRepository) {}

	async execute(): Promise<Project[]> {
		try {
			return await this.projectRepository.getAll();
		} catch (error: any) {
			throw error;
		}
	}
}
