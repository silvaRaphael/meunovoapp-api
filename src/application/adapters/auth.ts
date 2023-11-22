import { z } from "zod";

export const tokenSchema = z
	.string({
		required_error: "Token é necessário.",
	})
	.uuid({
		message: "Token válido é necessário.",
	});
export type TokenSchema = z.infer<typeof tokenSchema>;

export const signInSchema = z.object({
	email: z
		.string({
			required_error: "E-mail é necessário.",
		})
		.email({
			message: "E-mail válido é necessário.",
		}),
	password: z
		.string({
			required_error: "Senha é necessária.",
		})
		.min(6, {
			message: "A senha deve ter ao menos 6 digitos.",
		})
		.max(20, { message: "A senha deve ter ao máximo 20 digitos." }),
});
export type SignInSchema = z.infer<typeof signInSchema>;
