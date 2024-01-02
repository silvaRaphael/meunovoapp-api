import { Request } from "express";
import { ZodError } from "zod";
import { getLang, handleLanguage } from "./handle-language";

export const HandleError = (error: any, req?: Request) => {
	const zodError = error instanceof ZodError;

	const title = handleLanguage(
		[
			["en", "An error occurred!"],
			["pt", "Ocorreu algum erro!"],
		],
		getLang(req),
	);

	if (!zodError)
		return {
			title,
			errors: [
				{
					message: error.message,
					path: error.path,
				},
			],
		};

	return {
		title,
		errors: error.errors.map(({ message }) => ({
			message,
		})),
	};
};
