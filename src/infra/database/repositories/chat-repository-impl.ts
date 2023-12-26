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
					...chat,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async markAsRead(id: string): Promise<void> {
		try {
			await this.database.notification.update({
				data: {
					read: true,
				},
				where: { id },
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getOne(id: string): Promise<Chat | null> {
		try {
			const response = await this.database.chat.findFirst({
				select: {
					id: true,
					text: true,
					date: true,
					read: true,
					labels: true,
					receiver: {
						select: {
							id: true,
							name: true,
							email: true,
							avatar: true,
							is_manager: true,
						},
					},
				},
				where: { id },
				orderBy: { date: "desc" },
			});

			if (!response) return null;

			return response as unknown as Chat;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getUsers(user_id: string): Promise<User[]> {
		try {
			const response = await this.database.user.findMany({
				select: {
					id: true,
					name: true,
					email: true,
					avatar: true,
					is_manager: true,
				},
				where: {
					activated_at: { not: null },
					id: { not: user_id },
				},
				orderBy: { name: "asc" },
			});

			if (!response) return [];

			return response as unknown as User[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getContacts(user_id: string): Promise<Chat[]> {
		try {
			const response = await this.database.user.findMany({
				select: {
					chats: {
						select: {
							id: true,
							text: true,
							date: true,
							read: true,
							labels: true,
							receiver: {
								select: {
									id: true,
									name: true,
									email: true,
									avatar: true,
									is_manager: true,
								},
							},
						},
						orderBy: { date: "desc" },
						take: 1,
					},
					name: true,
				},
				where: {
					chats: {
						some: {
							OR: [{ user_id }, { receiver_id: user_id }],
						},
					},
					id: user_id,
				},
			});

			if (!response) return [];

			return response[0].chats.map((item) => ({
				...item,
				user: {
					id: user_id,
					name: response[0].name,
				},
			})) as unknown as Chat[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getMessages({
		user_id,
		receiver_id,
	}: {
		user_id: string;
		receiver_id: string;
	}): Promise<Chat[]> {
		try {
			const response = await this.database.chat.findMany({
				select: {
					id: true,
					text: true,
					date: true,
					read: true,
					labels: true,
					receiver: {
						select: {
							id: true,
							name: true,
							email: true,
							avatar: true,
							is_manager: true,
						},
					},
				},
				where: { user_id, receiver_id },
				orderBy: { date: "desc" },
			});

			if (!response) return [];

			return response as unknown as Chat[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
