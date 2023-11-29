import { z } from "zod";
import { projectStatuses } from "../../domain/project";

export const createProjectSchema = z.object({
	client_id: z
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
	due: z.date({
		required_error: "Prazo é necessário.",
	}),
});
export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
	id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
});
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
