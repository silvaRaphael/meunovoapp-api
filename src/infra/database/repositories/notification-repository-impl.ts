import { NotificationRepository } from "../../../application/repositories/notification-repository";
import { Notification } from "../../../domain/notification";
import { PrismaType } from "../prisma";

export class NotificationRepositoryImpl implements NotificationRepository {
	constructor(private database: PrismaType) {}

	async create(notification: Notification): Promise<void> {
		try {
			await this.database.notification.create({
				data: {
					...notification,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async markAsRead(notificationId: string): Promise<void> {
		try {
			await this.database.notification.update({
				data: {
					read: true,
				},
				where: {
					id: notificationId,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getAll(userId: string): Promise<Notification[]> {
		try {
			const response = await this.database.notification.findMany({
				select: {
					id: true,
					type: true,
					title: true,
					description: true,
					link: true,
				},
				where: {
					user_id: userId,
					read: false,
				},
				orderBy: { created_at: "desc" },
				take: 20,
			});

			if (!response) return [];

			return response as unknown as Notification[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
