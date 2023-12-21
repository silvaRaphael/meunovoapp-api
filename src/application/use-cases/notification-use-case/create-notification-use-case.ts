import { Notification } from "../../../domain/notification";
import { CreateNotificationSchema } from "../../adapters/notification";
import { NotificationRepository } from "../../repositories/notification-repository";

export class CreateNotificationUseCase {
	constructor(private notificationRepository: NotificationRepository) {}

	async execute(notification: CreateNotificationSchema): Promise<void> {
		try {
			const notificationToCreate = new Notification(notification);

			await this.notificationRepository.create(notificationToCreate);
		} catch (error) {
			throw error;
		}
	}
}
