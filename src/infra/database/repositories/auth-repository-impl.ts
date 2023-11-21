import { PrismaType } from "@db/prisma";
import { AuthRepository } from "@repositories/auth-repository";

export class AuthRepositoryImpl implements AuthRepository {
	constructor(private database: PrismaType) {}

	async signIn({ id, token }: { id: string; token: string }): Promise<void> {
		try {
			const response = await this.database.user.update({
				data: {
					token,
				},
				where: {
					id,
				},
			});

			if (!response) throw Error;
		} catch (error: any) {
			throw new Error("Não foi possível fazer login.");
		}
	}

	async signOut(token: string): Promise<void> {
		try {
			const response = await this.database.user.updateMany({
				data: {
					token: null,
				},
				where: {
					token,
				},
			});

			if (!response) throw Error;
		} catch (error: any) {
			throw new Error("Não foi possível sair.");
		}
	}
}
