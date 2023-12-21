import { UserPreferences } from "../../../domain/user-preferences";
import { UserPreferencesRepository } from "../../repositories/user-preferences-repository";

export class GetUserPreferencesUseCase {
	constructor(private userPreferencesRepository: UserPreferencesRepository) {}

	async execute(userId: string): Promise<UserPreferences | null> {
		try {
			const response = await this.userPreferencesRepository.getOne(
				userId,
			);

			if (!response)
				return {
					console_notification: true,
					email_notification: true,
				} as UserPreferences;

			return response;
		} catch (error: any) {
			throw error;
		}
	}
}
