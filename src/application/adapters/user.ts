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
	is_manager: z.boolean().optional(),
});
export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const completeUserSchema = z
	.object({
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
		avatarName: z.string().optional(),
		avatar: z.string().optional(),
		password: z
			.string({
				required_error: "Senha é necessária.",
			})
			.max(20, { message: "A senha deve ter ao máximo 20 digitos." }),
		confirm_password: z.string({
			required_error: "Confirme sua senha.",
		}),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "As senhas devem ser iguais.",
		path: ["confirm_password"],
	});
export type CompleteUserSchema = z.infer<typeof completeUserSchema>;

export const updateUserSchema = z
	.object({
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
		avatarName: z.string().optional(),
		avatar: z.string().optional(),
		old_password: z
			.string({ required_error: "Senha antiga é necessária." })
			.min(5, { message: "Digite uma senha maior." })
			.max(20, { message: "Digite uma senha menor." })
			.optional(),
		password: z
			.string({ required_error: "Nova senha é necessária." })
			.min(5, { message: "Digite uma senha maior." })
			.max(20, { message: "Digite uma senha menor." })
			.optional(),
	})
	.refine((data) => !data.password || (data.old_password && data.password), {
		message: "Digite sua senha antiga.",
	});
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
