import { UserPreferences } from "../../domain/user-preferences";

export interface UserPreferencesRepository {
	getOne(userId: string): Promise<UserPreferences | null>;
	create(preferences: UserPreferences): Promise<void>;
	update(preferences: UserPreferences): Promise<void>;
}
