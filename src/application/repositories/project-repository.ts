import { Project } from "../../domain/project";

export interface ProjectRepository {
	create(user: Project): Promise<void>;
	update(user: Project): Promise<void>;
	getAll(): Promise<Project[]>;
	getOne(id: string): Promise<Project | null>;
}
