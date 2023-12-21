import { z } from "zod";

export const preferencesUserSchema = z.object({
	email_notification: z.boolean().optional(),
	console_notification: z.boolean().optional(),
});

export type PreferencesUserSchema = z.infer<typeof preferencesUserSchema>;

export const updateUserPreferencesSchema = z.object({
	user_id: z
		.string({
			required_error: "ID é necessário.",
		})
		.uuid({
			message: "ID válido é necessário.",
		}),
});
export type UpdateUserPreferencesSchema = z.infer<
	typeof updateUserPreferencesSchema
>;
