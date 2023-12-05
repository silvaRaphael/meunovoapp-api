import { Project } from "../../domain/project";

export interface ProjectFilter {
	client_id?: string;
}

export interface ProjectRepository {
	create(user: Project): Promise<void>;
	update(user: Project): Promise<void>;
	getAll(filters?: ProjectFilter): Promise<Project[]>;
	getOne(id: string): Promise<Project | null>;
}
