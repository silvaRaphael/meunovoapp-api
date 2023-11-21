export interface AuthRepository {
	signIn(data: { id: string; token: string }): Promise<void>;
	signOut(token: string): Promise<void>;
}
