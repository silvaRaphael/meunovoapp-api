import { Task } from "../../domain/task";

export interface TaskFilter {
	client_id?: string;
}

export interface TaskRepository {
	create(user: Task): Promise<void>;
	update(user: Task): Promise<void>;
	getAll(filters?: TaskFilter): Promise<Task[]>;
	getOne(id: string): Promise<Task | null>;
}
