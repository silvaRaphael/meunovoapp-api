import { Task } from "../../domain/task";

export interface TaskRepository {
	create(user: Task): Promise<void>;
	update(user: Task): Promise<void>;
	getAll(): Promise<Task[]>;
	getOne(id: string): Promise<Task | null>;
}
