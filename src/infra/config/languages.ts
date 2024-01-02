import { Request } from "express";

export type Langs = "pt" | "en";

export interface Language {
	label: string;
	lang: Langs;
	locale: string;
	currency: string;
}

export const languages: Language[] = [
	{
		label: "Português",
		lang: "pt",
		locale: "pt-BR",
		currency: "BRL",
	},
	{
		label: "English",
		lang: "en",
		locale: "en-US",
		currency: "USD",
	},
];

export interface LanguageRequest extends Request {
	language: Language;
}
