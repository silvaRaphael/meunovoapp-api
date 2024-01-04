import { Notification } from "../../domain/notification";

export interface NotificationRepository {
	create(notification: Notification): Promise<void>;
	markAsRead(userId: string): Promise<void>;
	getAll(userId: string): Promise<Notification[]>;
}
