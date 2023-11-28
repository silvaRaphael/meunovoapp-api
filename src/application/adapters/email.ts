import { z } from "zod";

export const sendEmailSchema = z.object({
	name: z
		.string({
			required_error: "Nome é necessário.",
		})
		.max(50, { message: "O nome deve ter ao máximo 50 digitos." }),
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
	no_save: z.boolean().optional(),
});
export type SendEmailSchema = z.infer<typeof sendEmailSchema>;

export const replyEmailSchema = z.object({
	replyed: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "Id válido é necessário.",
		}),
});
export type ReplyEmailSchema = z.infer<typeof replyEmailSchema>;
