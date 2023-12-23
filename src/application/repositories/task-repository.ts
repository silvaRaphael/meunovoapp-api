import { Task } from "../../domain/task";

export interface TaskFilter {
	client_id?: string;
}

export interface TaskRepository {
	create(user: Task): Promise<{
		projectName: string;
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
	update(user: Task): Promise<{
		projectName: string;
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
	getAll(filters?: TaskFilter): Promise<Task[]>;
	getOne(id: string): Promise<Task | null>;
}
