import { z } from "zod";

export const createNotificationSchema = z.object({
	user_id: z
		.string({
			required_error: "ID do usuário é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
	type: z.enum(["error", "pending", "started", "done"], {
		required_error: "Tipo de notificação é necessário.",
	}),
	title: z
		.string({
			required_error: "Título é necessário.",
		})
		.max(50, { message: "O título deve ter ao máximo 50 digitos." }),
	description: z
		.string({
			required_error: "Descrição é necessária.",
		})
		.max(100, { message: "A descrição deve ter ao máximo 100 digitos." })
		.optional(),
	link: z
		.string({
			required_error: "Link é necessária.",
		})
		.optional(),
});
export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;

export const updateNotificationSchema = z.object({
	id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
});
export type UpdateNotificationSchema = z.infer<typeof updateNotificationSchema>;
