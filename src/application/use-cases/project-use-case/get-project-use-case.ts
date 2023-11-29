import { Project } from "../../../domain/project";
import { ProjectRepository } from "../../repositories/project-repository";

export class GetProjectUseCase {
	constructor(private projectRepository: ProjectRepository) {}

	async execute(id: string): Promise<Project | null> {
		try {
			return await this.projectRepository.getOne(id);
		} catch (error: any) {
			throw error;
		}
	}
}
