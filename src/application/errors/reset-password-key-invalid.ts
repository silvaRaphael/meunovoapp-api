import { LanguageRequest, languages } from "../../infra/config/languages";
import { handleLanguage } from "../../infra/http/utils/handle-language";

export class InvalidResetPasswordKeyError extends Error {
	message: string;

	constructor(private req?: LanguageRequest) {
		super();

		const language = this.req?.language;

		this.message = handleLanguage(
			[
				["en", "Invalid recovery key."],
				["pt", "Chave de recuperação inválida."],
			],
			language?.lang ?? languages[0].lang,
		);
	}
}
