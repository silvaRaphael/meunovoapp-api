import { z } from "zod";

export const uploadFileSchema = z.object({
	fileName: z
		.string({
			required_error: "Nome do arquivo é necessário.",
		})
		.optional(),
	base64: z.string({
		required_error: "Nome do arquivo é necessário.",
	}),
});
export type UploadFileSchema = z.infer<typeof uploadFileSchema>;
