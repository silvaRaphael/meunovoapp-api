import { LanguageRequest, languages } from "../../infra/config/languages";
import { handleLanguage } from "../../infra/http/utils/handle-language";

export class UserNotFoundError extends Error {
	message: string;

	constructor(private req?: LanguageRequest) {
		super();

		const language = this.req?.language;

		this.message = handleLanguage(
			[
				["en", "User not found."],
				["pt", "Usuário não encontrado."],
			],
			language?.lang ?? languages[0].lang,
		);
	}
}
