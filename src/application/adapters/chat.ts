import { z } from "zod";
import { chatLabelTypes } from "../../domain/chat";

export const createChatSchema = z.object({
	receiver_id: z
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
			z.enum(chatLabelTypes, {
				required_error: "Label é nencessária.",
			}),
		)
		.optional(),
});
export type CreateChatSchema = z.infer<typeof createChatSchema>;

export const updateChatSchema = z.object({
	id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
});
export type UpdateChatSchema = z.infer<typeof updateChatSchema>;
