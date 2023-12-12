import { z } from "zod";
import { emailTypes } from "../../domain/email";

export const sendEmailSchema = z.object({
	name: z
		.string({
			required_error: "Nome é necessário.",
		})
		.max(50, { message: "O nome deve ter ao máximo 50 digitos." })
		.optional(),
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
	title: z
		.string({
			required_error: "Título é necessário.",
		})
		.optional(),
	subject: z
		.string({
			required_error: "Assunto é necessário.",
		})
		.max(200, { message: "O assunto deve ter ao máximo 200 digitos." }),
	html: z
		.string({
			required_error: "Html é necessário.",
		})
		.optional(),
	type: z
		.enum(emailTypes, {
			required_error: "Tipo é nencessário.",
		})
		.optional(),
	no_save: z.boolean().optional(),
});
export type SendEmailSchema = z.infer<typeof sendEmailSchema>;

export const replyEmailSchema = z.object({
	replied: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "Id válido é necessário.",
		}),
});
export type ReplyEmailSchema = z.infer<typeof replyEmailSchema>;

export const sendUserInviteMessageEmailSchema = z.object({
	userId: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "Id válido é necessário.",
		}),
});
export type SendUserInviteMessageEmailSchema = z.infer<
	typeof sendUserInviteMessageEmailSchema
>;

export const sendContactMessageEmailSchema = z.object({
	email: z.string({
		required_error: "E-mail é necessário.",
	}),
	phone: z.string({
		required_error: "Celular é necessário.",
	}),
	message: z.string({
		required_error: "Mensagem é necessária.",
	}),
});
export type sendContactMessageEmailSchema = z.infer<
	typeof sendContactMessageEmailSchema
>;

export const sendBudgetMessageEmailSchema = z.object({
	email: z.string({
		required_error: "E-mail é necessário.",
	}),
	phone: z.string({
		required_error: "Celular é necessário.",
	}),
	company: z.string({
		required_error: "Empresa é necessária.",
	}),
	role: z.string({
		required_error: "Cargo é necessário.",
	}),
	description: z.string({
		required_error: "Descrição é necessária.",
	}),
	projectType: z.string({
		required_error: "Tipo de projeto é necessário.",
	}),
	budget: z.string({
		required_error: "Orçamento do projeto é necessário.",
	}),
	due: z.string({
		required_error: "Prazo do projeto é necessário.",
	}),
});
export type SendBudgetMessageEmailSchema = z.infer<
	typeof sendBudgetMessageEmailSchema
>;

export const replyContactMessageEmailSchema = z.object({
	receivedMessage: z.string({
		required_error: "Mensagem recebida é necessária.",
	}),
	message: z.string({
		required_error: "Mensagem é necessária.",
	}),
});
export type ReplyContactMessageEmailSchema = z.infer<
	typeof replyContactMessageEmailSchema
>;

export const replyBudgetMessageEmailSchema = z.object({
	projectDetails: z.string({
		required_error: "Detalhes do projeto é necessário.",
	}),
	projectScope: z.string({
		required_error: "Escopo do projeto é necessário.",
	}),
	projectStartDate: z.string({
		required_error: "Data de início do projeto é necessária.",
	}),
	projectEndDate: z.string({
		required_error: "Data de término do projeto é necessária.",
	}),
	projectPayment: z.string({
		required_error: "Método de pagamento é necessário.",
	}),
	projectBenefits: z.string({
		required_error: "Benefícios do projeto é necessário.",
	}),
});
export type ReplyBudgetMessageEmailSchema = z.infer<
	typeof replyBudgetMessageEmailSchema
>;
