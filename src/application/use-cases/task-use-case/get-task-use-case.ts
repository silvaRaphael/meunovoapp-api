import { Task } from "../../../domain/task";
import { TaskRepository } from "../../repositories/task-repository";

export class GetTaskUseCase {
	constructor(private taskRepository: TaskRepository) {}

	async execute(id: string): Promise<Task | null> {
		try {
			return await this.taskRepository.getOne(id);
		} catch (error: any) {
			throw error;
		}
	}
}
