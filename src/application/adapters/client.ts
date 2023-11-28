import { z } from "zod";

export const createClientSchema = z.object({
	company: z
		.string({
			required_error: "Empresa é necessário.",
		})
		.max(50, { message: "A empresa deve ter ao máximo 50 digitos." }),
	logotipo: z.string().optional(),
});
export type CreateClientSchema = z.infer<typeof createClientSchema>;

export const updateClientSchema = z.object({
	id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
});
export type UpdateClientSchema = z.infer<typeof updateClientSchema>;
