import { User } from "../../../domain/user";
import { UpdateUserSchema } from "../../adapters/user";
import { UserRepository } from "../../repositories/user-repository";

export class UpdateUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute({
		id,
		name,
		email,
		avatar,
		password,
	}: { id: string } & UpdateUserSchema): Promise<void> {
		try {
			const userToUpdate = new User({
				id,
				name,
				email,
				avatar,
				password,
				role: "client",
				activated_at: new Date(),
			});

			await this.userRepository.update(userToUpdate);
		} catch (error: any) {
			throw error;
		}
	}
}
