import { AuthRepository } from "../../../application/repositories/auth-repository";
import { User } from "../../../domain/user";
import { PrismaType } from "../prisma";

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

	async validateToken(token: string): Promise<User | null> {
		try {
			const response = await this.database.user.findFirst({
				where: {
					token,
				},
			});

			if (!response) return null;

			return response as User;
		} catch (error: any) {
			throw new Error("Não foi possível validar o token.");
		}
	}
}
