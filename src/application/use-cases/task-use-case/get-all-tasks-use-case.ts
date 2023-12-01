import { Task } from "../../../domain/task";
import { TaskRepository } from "../../repositories/task-repository";

export class GetAllTasksUseCase {
	constructor(private taskRepository: TaskRepository) {}

	async execute(): Promise<Task[]> {
		try {
			return await this.taskRepository.getAll();
		} catch (error: any) {
			throw error;
		}
	}
}
