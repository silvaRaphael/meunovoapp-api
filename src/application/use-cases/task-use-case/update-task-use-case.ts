import { Task } from "../../../domain/task";
import { CreateTaskSchema, UpdateTaskSchema } from "../../adapters/task";
import { TaskRepository } from "../../repositories/task-repository";

export class UpdateTaskUseCase {
	constructor(private taskRepository: TaskRepository) {}

	async execute(task: UpdateTaskSchema & CreateTaskSchema): Promise<void> {
		try {
			const taskToUpdate = new Task(task);

			await this.taskRepository.update(taskToUpdate);
		} catch (error: any) {
			throw error;
		}
	}
}
