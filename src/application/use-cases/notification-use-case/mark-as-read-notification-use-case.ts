import { NotificationRepository } from "../../repositories/notification-repository";

export class MarkAsReadNotificationUseCase {
	constructor(private notificationRepository: NotificationRepository) {}

	async execute(notificationId: string): Promise<void> {
		try {
			await this.notificationRepository.markAsRead(notificationId);
		} catch (error) {
			throw error;
		}
	}
}
