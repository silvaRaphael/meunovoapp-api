import { UserPreferences } from "../../../domain/user-preferences";
import {
	PreferencesUserSchema,
	UpdateUserPreferencesSchema,
} from "../../adapters/preferences";
import { UserPreferencesRepository } from "../../repositories/user-preferences-repository";

export class UpdateUserPreferencesUseCase {
	constructor(private userPreferencesRepository: UserPreferencesRepository) {}

	async execute(
		preferences: PreferencesUserSchema & UpdateUserPreferencesSchema,
	): Promise<void> {
		try {
			const preferencesToUpdate = new UserPreferences(preferences);

			const userPreferences = await this.userPreferencesRepository.getOne(
				preferences.user_id,
			);

			if (!userPreferences) {
				await this.userPreferencesRepository.create(
					preferencesToUpdate,
				);
				return;
			}

			await this.userPreferencesRepository.update(preferencesToUpdate);
		} catch (error: any) {
			throw error;
		}
	}
}
