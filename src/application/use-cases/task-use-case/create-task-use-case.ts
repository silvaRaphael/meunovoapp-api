import { Task } from "../../../domain/task";
import { CreateTaskSchema } from "../../adapters/task";
import { TaskRepository } from "../../repositories/task-repository";

export class CreateTaskUseCase {
	constructor(private taskRepository: TaskRepository) {}

	async execute(task: CreateTaskSchema): Promise<{ userId: string }[]> {
		try {
			const taskToCreate = new Task(task);

			return await this.taskRepository.create(taskToCreate);
		} catch (error: any) {
			throw error;
		}
	}
}
