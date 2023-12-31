import { z } from "zod";
import { messageLabelTypes } from "../../domain/message";

export const createMessageSchema = z.object({
	id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		})
		.optional(),
	chat_id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
	text: z
		.string({
			required_error: "Mensagem é necessária.",
		})
		.max(500, { message: "A mensagem deve ter ao máximo 500 digitos." }),
	labels: z
		.array(
			z.enum(messageLabelTypes, {
				required_error: "Label é nencessária.",
			}),
		)
		.optional(),
	receiver_id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		})
		.optional(),
});
export type CreateMessageSchema = z.infer<typeof createMessageSchema>;

export const updateMessageSchema = z.object({
	chat_id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
	user_id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
});
export type UpdateMessageSchema = z.infer<typeof updateMessageSchema>;
