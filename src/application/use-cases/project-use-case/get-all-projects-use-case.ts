import { Project } from "../../../domain/project";
import {
	ProjectFilter,
	ProjectRepository,
} from "../../repositories/project-repository";

export class GetAllProjectsUseCase {
	constructor(private projectRepository: ProjectRepository) {}

	async execute(filters?: ProjectFilter): Promise<Project[]> {
		try {
			return await this.projectRepository.getAll(filters);
		} catch (error: any) {
			throw error;
		}
	}
}
