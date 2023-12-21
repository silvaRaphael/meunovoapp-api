import { Task } from "../../domain/task";

export interface TaskFilter {
	client_id?: string;
}

export interface TaskRepository {
	create(user: Task): Promise<{ userId: string }[]>;
	update(user: Task): Promise<{ userId: string }[]>;
	getAll(filters?: TaskFilter): Promise<Task[]>;
	getOne(id: string): Promise<Task | null>;
}
