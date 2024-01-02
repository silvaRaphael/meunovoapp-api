export const genPasswordKey = (password: string) =>
	password?.substring(password.length - 12, password.length);
