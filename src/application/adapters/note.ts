import { z } from "zod";

export const createNoteSchema = z.object({
	title: z
		.string({
			required_error: "Título é necessário.",
		})
		.max(50, { message: "O título deve ter ao máximo 50 digitos." }),
	content: z
		.string({
			required_error: "Conteúdo é necessário.",
		})
		.max(500, { message: "O conteúdo deve ter ao máximo 500 digitos." })
		.optional(),
	markers: z
		.array(
			z.string({
				required_error: "Marcador é necessário.",
			}),
		)
		.optional(),
});
export type CreateNoteSchema = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z.object({
	id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
});
export type UpdateNoteSchema = z.infer<typeof updateNoteSchema>;
