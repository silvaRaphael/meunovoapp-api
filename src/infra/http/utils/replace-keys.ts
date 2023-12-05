export function replaceKeys(string: string, replaces: {}) {
	Object.entries(replaces).forEach((item) => {
		string = string.replaceAll(item[0], item[1] as string);
	});

	return string;
}
