import { ChatRepository } from "../../../application/repositories/chat-repository";
import { Chat } from "../../../domain/chat";
import { User } from "../../../domain/user";
import { PrismaType } from "../prisma";

export class ChatRepositoryImpl implements ChatRepository {
	constructor(private database: PrismaType) {}

	async create(chat: Chat): Promise<void> {
		try {
			await this.database.chat.create({
				data: {
					id: chat.id,
					participant1_id: chat.participants_id[0],
					participant2_id: chat.participants_id[1],
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getOne(chat_id: string): Promise<Chat | null> {
		try {
			const response = await this.database.chat.findFirst({
				select: {
					id: true,
					participant1_id: true,
					participant2_id: true,
				},
				where: {
					id: chat_id,
				},
			});

			if (!response) return null;

			return {
				id: response.id,
				participants_id: [
					response.participant1_id,
					response.participant2_id,
				],
			} as Chat;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getUsers(filter: {
		user_id: string;
		client_id?: string;
	}): Promise<User[]> {
		const where = {
			activated_at: { not: null },
			id: { not: filter.user_id },
		};

		if (filter.client_id)
			(where as any).OR = [
				{ client_id: filter.client_id },
				{ role: "master" },
			];

		try {
			const response = await this.database.user.findMany({
				select: {
					id: true,
					name: true,
					email: true,
					avatar: true,
					is_manager: true,
				},
				where,
				orderBy: { name: "asc" },
			});

			if (!response) return [];

			return response as unknown as User[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getAll(user_id: string): Promise<Chat[]> {
		try {
			const response = await this.database.chat.findMany({
				select: {
					id: true,
					participant1: {
						select: {
							id: true,
							name: true,
							email: true,
							avatar: true,
							is_manager: true,
						},
					},
					participant2: {
						select: {
							id: true,
							name: true,
							email: true,
							avatar: true,
							is_manager: true,
						},
					},
					messages: {
						orderBy: { date: "desc" },
						take: 1,
					},
				},
				where: {
					OR: [
						{ participant1_id: user_id },
						{ participant2_id: user_id },
					],
				},
			});

			if (!response) return [];

			return response
				.map((item) => ({
					id: item.id,
					user:
						item.participant1.id === user_id
							? item.participant1
							: item.participant2,
					participant:
						item.participant1.id === user_id
							? item.participant2
							: item.participant1,
					last_message: item.messages.length
						? item.messages[0]
						: null,
				}))
				.sort(
					(a, b) =>
						(b?.last_message?.date?.getTime() ?? 1) -
						(a?.last_message?.date?.getTime() ?? 1),
				) as Chat[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
