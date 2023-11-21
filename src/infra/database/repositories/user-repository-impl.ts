import { UserRepository } from "../../../application/repositories/user-repository";
import { PrismaType } from "../prisma";
import { User } from "../../../domain/user";

export class UserRepositoryImpl implements UserRepository {
    constructor(private database: PrismaType) {}

    async getAll(): Promise<User[]> {
        try {
            const response = await this.database.user.findMany({});

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
            });

            if (!response) return null;

            return response as unknown as User;
        } catch (error: any) {
            throw new Error("DB Error.");
        }
    }
}
