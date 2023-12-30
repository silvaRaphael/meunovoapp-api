import { z } from "zod";

export const createChatSchema = z.object({
	id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		})
		.optional(),
	receiver_id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
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
