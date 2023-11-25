import { z } from "zod";

export const emailSchema = z.object({
	name: z
		.string({
			required_error: "Nome é necessário.",
		})
		.max(50, { message: "O nome deve ter ao máximo 20 digitos." }),
	from: z.string({
		required_error: "E-mail é necessário.",
	}),
	to: z.array(
		z
			.string({
				required_error: "E-mail é necessário.",
			})
			.email({
				message: "E-mail válido é necessário.",
			}),
	),
	subject: z
		.string({
			required_error: "Assunto é necessário.",
		})
		.max(200, { message: "O assunto deve ter ao máximo 200 digitos." }),
	html: z.string({
		required_error: "Html é necessário.",
	}),
});
export type EmailSchema = z.infer<typeof emailSchema>;
