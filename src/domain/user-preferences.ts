export interface IUserPreferences {
	user_id: string;
	email_notification?: boolean;
	console_notification?: boolean;
}

export class UserPreferences {
	user_id: string;
	email_notification: boolean;
	console_notification: boolean;

	constructor({
		user_id,
		email_notification,
		console_notification,
	}: IUserPreferences) {
		this.user_id = user_id;
		this.email_notification = email_notification ?? true;
		this.console_notification = console_notification ?? true;
	}
}
