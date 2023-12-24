import { UserRepository } from "../../../application/repositories/user-repository";
import { User } from "../../../domain/user";
import { PrismaType } from "../prisma";

export class UserRepositoryImpl implements UserRepository {
	constructor(private database: PrismaType) {}

	async create(user: User): Promise<void> {
		(user as any).activated_at = undefined;

		try {
			await this.database.user.create({
				data: {
					...user,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async update(user: User): Promise<void> {
		try {
			await this.database.user.update({
				data: {
					...user,
				},
				where: {
					id: user.id,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getAll(): Promise<User[]> {
		try {
			const response = await this.database.user.findMany({
				where: {
					role: { not: "master" },
					password: { not: null },
				},
				select: {
					id: true,
					name: true,
					email: true,
					is_manager: true,
					avatar: true,
					activated_at: true,
					client: {
						select: {
							id: true,
							company: true,
							logotipo: true,
						},
					},
				},
				orderBy: [
					{ is_manager: "desc" },
					{ activated_at: "asc" },
					{ invited_at: "asc" },
				],
			});

			if (!response) return [];

			return response as unknown as User[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getOne(id: string): Promise<User | null> {
		try {
			const response = await this.database.user.findFirst({
				where: {
					id,
				},
				select: {
					id: true,
					name: true,
					email: true,
					avatar: true,
					is_manager: true,
					invited_at: true,
					activated_at: true,
					notifications: true,
					userPreferences: true,
					client: {
						where: {
							users: {
								some: {
									id,
									is_manager: true,
								},
							},
						},
					},
				},
			});

			if (!response) return null;

			return response as unknown as User;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getOneByEmail(email: string): Promise<User | null> {
		try {
			const response = await this.database.user.findFirst({
				where: {
					email,
				},
			});

			if (!response) return null;

			return response as unknown as User;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
