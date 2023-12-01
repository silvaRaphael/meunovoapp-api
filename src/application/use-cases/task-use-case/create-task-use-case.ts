import { Task } from "../../../domain/task";
import { CreateTaskSchema } from "../../adapters/task";
import { TaskRepository } from "../../repositories/task-repository";

export class CreateTaskUseCase {
	constructor(private taskRepository: TaskRepository) {}

	async execute(task: CreateTaskSchema): Promise<void> {
		try {
			const taskToCreate = new Task(task);

			await this.taskRepository.create(taskToCreate);
		} catch (error: any) {
			throw error;
		}
	}
}
