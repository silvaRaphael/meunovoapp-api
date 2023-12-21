import { Notification } from "../../../domain/notification";
import { NotificationRepository } from "../../repositories/notification-repository";

export class GetAllNotificationsUseCase {
	constructor(private notificationRepository: NotificationRepository) {}

	async execute(userId: string): Promise<Notification[]> {
		try {
			return await this.notificationRepository.getAll(userId);
		} catch (error: any) {
			throw error;
		}
	}
}
