import { z } from "zod";

export const createUserSchema = z.object({
	email: z
		.string({
			required_error: "E-mail é necessário.",
		})
		.email({ message: "Digite um e-mail válido" }),
	client_id: z
		.string({
			required_error: "ID do cliente é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
});
export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
	name: z
		.string({
			required_error: "Nome é necessário.",
		})
		.max(50, { message: "O nome deve ter ao máximo 50 digitos." }),
	email: z
		.string({
			required_error: "E-mail é necessário.",
		})
		.email({ message: "Digite um e-mail válido" }),
	password: z
		.string({
			required_error: "Senha é necessária.",
		})
		.max(20, { message: "A senha deve ter ao máximo 20 digitos." }),
});
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
