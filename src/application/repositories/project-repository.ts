import { Project } from "../../domain/project";

export interface ProjectFilter {
	client_id?: string;
}

export interface ProjectRepository {
	create(user: Project): Promise<{
		users: {
			id: string;
			name: string | null;
			email: string;
			userPreferences: {
				email_notification: boolean;
				console_notification: boolean;
			} | null;
		}[];
	}>;
	update(user: Project): Promise<{
		users: {
			id: string;
			name: string | null;
			email: string;
			userPreferences: {
				email_notification: boolean;
				console_notification: boolean;
			} | null;
		}[];
	}>;
	getAll(filters?: ProjectFilter): Promise<Project[]>;
	getOne(id: string): Promise<Project | null>;
}
