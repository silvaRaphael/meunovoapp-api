import { UserPreferencesRepository } from "../../../application/repositories/user-preferences-repository";
import { UserPreferences } from "../../../domain/user-preferences";
import { PrismaType } from "../prisma";

export class UserPreferencesRepositoryImpl
	implements UserPreferencesRepository
{
	constructor(private database: PrismaType) {}

	async getOne(userId: string): Promise<UserPreferences | null> {
		try {
			const response = await this.database.userPreferences.findFirst({
				where: {
					user_id: userId,
				},
				select: {
					console_notification: true,
					email_notification: true,
				},
			});

			if (!response) return null;

			return response as unknown as UserPreferences;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async create(preferences: UserPreferences): Promise<void> {
		try {
			const response = await this.database.userPreferences.create({
				data: {
					user_id: preferences.user_id,
					console_notification: preferences.console_notification,
					email_notification: preferences.email_notification,
				},
			});

			if (!response) throw Error;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async update(preferences: UserPreferences): Promise<void> {
		try {
			const response = await this.database.userPreferences.update({
				data: {
					email_notification: preferences.email_notification,
					console_notification: preferences.console_notification,
				},
				where: {
					user_id: preferences.user_id,
				},
			});

			if (!response) throw Error;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
