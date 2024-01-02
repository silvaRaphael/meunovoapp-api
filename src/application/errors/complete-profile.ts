import { Request } from "express";
import { LanguageRequest, languages } from "../../infra/config/languages";
import { handleLanguage } from "../../infra/http/utils/handle-language";

export class CompleteProfileError extends Error {
	message: string;

	constructor(private req?: Request) {
		super();

		const { language } = this.req as LanguageRequest;

		this.message = handleLanguage(
			[
				["en", "Inactive User. Complete you registration before."],
				["pt", "Usuário inativo. Complete seu perfil antes."],
			],
			language.lang ?? languages[0].lang,
		);
	}
}
