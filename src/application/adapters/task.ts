import { z } from "zod";

export const createTaskSchema = z.object({
	project_id: z
		.string({
			required_error: "ID do cliente é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
	name: z
		.string({
			required_error: "Nome é necessário.",
		})
		.max(50, { message: "O nome deve ter ao máximo 50 digitos." }),
	description: z
		.string({
			required_error: "Descrição é necessária.",
		})
		.max(500, { message: "A descrição deve ter ao máximo 500 digitos." })
		.optional(),
	status: z
		.enum(["waiting", "in progress", "completed", "cancelled"], {
			required_error: "Status é necessário.",
		})
		.optional(),
});
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
	id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
});
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
