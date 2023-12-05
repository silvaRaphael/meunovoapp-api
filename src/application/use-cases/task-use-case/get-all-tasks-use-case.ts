import { Task } from "../../../domain/task";
import { TaskFilter, TaskRepository } from "../../repositories/task-repository";

export class GetAllTasksUseCase {
	constructor(private taskRepository: TaskRepository) {}

	async execute(filters?: TaskFilter): Promise<Task[]> {
		try {
			return await this.taskRepository.getAll(filters);
		} catch (error: any) {
			throw error;
		}
	}
}
