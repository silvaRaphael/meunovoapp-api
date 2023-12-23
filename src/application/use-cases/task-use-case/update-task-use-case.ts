import { Task } from "../../../domain/task";
import { CreateTaskSchema, UpdateTaskSchema } from "../../adapters/task";
import { TaskRepository } from "../../repositories/task-repository";

export class UpdateTaskUseCase {
	constructor(private taskRepository: TaskRepository) {}

	async execute(task: UpdateTaskSchema & CreateTaskSchema): Promise<{
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
	}> {
		try {
			if (task.status === "in progress" && !task.startDate)
				(task as Task).startDate = new Date();

			if ((["cancelled", "completed"] as any).includes(task.status))
				(task as Task).endDate = new Date();

			const taskToUpdate = new Task(task);

			return await this.taskRepository.update(taskToUpdate);
		} catch (error: any) {
			throw error;
		}
	}
}
