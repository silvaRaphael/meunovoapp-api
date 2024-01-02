import { NextFunction, Request, Response } from "express";
import { languages } from "../../config/languages";

export const LanguageMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const contentLanguage = req.headers["content-language"];

	(req as any).language =
		languages.find((item) => item.locale === contentLanguage) ??
		languages[0];

	next();
};
