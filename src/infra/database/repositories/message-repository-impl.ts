import { UpdateMessageSchema } from "../../../application/adapters/message";
import { MessageRepository } from "../../../application/repositories/message-repository";
import { Message } from "../../../domain/message";
import { PrismaType } from "../prisma";

export class MessageRepositoryImpl implements MessageRepository {
	constructor(private database: PrismaType) {}

	async create(message: Message): Promise<void> {
		try {
			await this.database.message.create({
				data: {
					id: message.id,
					chat_id: message.chat_id,
					user_id: message.user_id,
					text: message.text,
					date: message.date,
					read: message.read,
					labels: message.labels,
				},
			});
		} catch (error: any) {
			console.log(error);
			throw new Error("DB Error.");
		}
	}

	async markAsRead(message: UpdateMessageSchema): Promise<void> {
		try {
			await this.database.message.updateMany({
				data: {
					read: true,
				},
				where: {
					chat_id: message.chat_id,
					user_id: message.user_id,
				},
			});
		} catch (error: any) {
			console.log(error);
			throw new Error("DB Error.");
		}
	}

	async getAll(chat_id: string): Promise<Message[]> {
		try {
			const response = await this.database.message.findMany({
				select: {
					id: true,
					text: true,
					date: true,
					read: true,
					labels: true,
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							avatar: true,
						},
					},
					chat: {
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
						},
					},
				},
				where: { chat_id },
				orderBy: { date: "desc" },
				take: 50,
			});

			if (!response) return [];

			return response
				.map((item) => ({
					id: item.id,
					chat_id: item.chat.id,
					user: item.user,
					participant:
						item.chat.participant1.id === item.user.id
							? item.chat.participant2
							: item.chat.participant1,
					date: item.date,
					read: item.read,
					text: item.text,
					labels: item.labels,
				}))
				.sort(
					(a, b) =>
						(a.date?.getTime() ?? 1) - (b.date?.getTime() ?? 1),
				) as Message[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
