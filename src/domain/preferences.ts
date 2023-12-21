export interface IUserPreferences {
	user_id: string;
	emailNotifications?: boolean;
	consoleNotifications?: boolean;
}

export class UserPreferences {
	user_id: string;
	emailNotifications: boolean;
	consoleNotifications: boolean;

	constructor({
		user_id,
		emailNotifications,
		consoleNotifications,
	}: IUserPreferences) {
		this.user_id = user_id;
		this.emailNotifications = emailNotifications ?? true;
		this.consoleNotifications = consoleNotifications ?? true;
	}
}
