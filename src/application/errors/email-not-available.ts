import { LanguageRequest, languages } from "../../infra/config/languages";
import { handleLanguage } from "../../infra/http/utils/handle-language";

export class EmailNotAvailableError extends Error {
	message: string;

	constructor(private req?: LanguageRequest) {
		super();

		const language = this.req?.language;

		this.message = handleLanguage(
			[
				["en", "Email not available."],
				["pt", "E-mail não disponível."],
			],
			language?.lang ?? languages[0].lang,
		);
	}
}
