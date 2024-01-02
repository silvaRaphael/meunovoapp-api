import { Request } from "express";
import { LanguageRequest, languages } from "../../infra/config/languages";
import { handleLanguage } from "../../infra/http/utils/handle-language";

export class SessionExpiredError extends Error {
	message: string;

	constructor(private req?: Request) {
		super();

		const { language } = this.req as LanguageRequest;

		this.message = handleLanguage(
			[
				["en", "Session expired."],
				["pt", "Sessão expirada."],
			],
			language.lang ?? languages[0].lang,
		);
	}
}
