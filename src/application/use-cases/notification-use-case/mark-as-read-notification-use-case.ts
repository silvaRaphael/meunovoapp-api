import { NotificationRepository } from "../../repositories/notification-repository";

export class MarkAsReadNotificationUseCase {
	constructor(private notificationRepository: NotificationRepository) {}

	async execute(userId: string): Promise<void> {
		try {
			await this.notificationRepository.markAsRead(userId);
		} catch (error) {
			throw error;
		}
	}
}
