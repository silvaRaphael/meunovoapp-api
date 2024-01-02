export const replaceKeys = <T>(string: string, replaces: T) => {
	Object.entries(replaces as {}).forEach((item) => {
		string = string.replaceAll(item[0], item[1] as string);
	});

	return string;
};
