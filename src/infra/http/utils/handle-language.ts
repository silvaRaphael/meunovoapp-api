import { Request } from "express";
import { Langs, LanguageRequest, languages } from "../../config/languages";

export const handleLanguage = (texts: [Langs, string][], lang?: Langs) => {
	const text = texts.find((item) => item[0] === lang) as Array<string>;

	if (!text) return texts[0][1];

	return text[1];
};

export const getLang = (req?: Request) => {
	return (req as LanguageRequest).language?.lang ?? languages[0].lang;
};
