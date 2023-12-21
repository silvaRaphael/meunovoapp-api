import { Notification } from "../../domain/notification";

export interface NotificationRepository {
	create(notification: Notification): Promise<void>;
	markAsRead(notificationId: string): Promise<void>;
	getAll(userId: string): Promise<Notification[]>;
}
