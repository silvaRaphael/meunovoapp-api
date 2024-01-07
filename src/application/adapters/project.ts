import { z } from "zod";

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
	budget: z
		.number({
			required_error: "Orçamento é necessário.",
			coerce: true,
		})
		.optional(),
	status: z
		.enum(["waiting", "in progress", "completed", "cancelled"], {
			required_error: "Status é necessário.",
		})
		.optional(),
	due: z.coerce.date({
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
