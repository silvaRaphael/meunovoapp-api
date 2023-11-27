import { ZodError } from "zod";

export const HandleError = (error: any) => {
	const zodError = error instanceof ZodError;

	if (!zodError)
		return [
			{
				message: error.message,
				path: error.path,
			},
		];

	return error.errors.map(({ message }) => ({
		message,
	}));
};
