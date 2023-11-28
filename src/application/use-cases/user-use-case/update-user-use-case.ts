import { User } from "../../../domain/user";
import { UpdateUserSchema } from "../../adapters/user";
import { UserRepository } from "../../repositories/user-repository";

export class UpdateUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute({
		id,
		name,
		email,
		password,
	}: { id: string } & UpdateUserSchema): Promise<void> {
		try {
			const userToUpdate = new User({
				id,
				name,
				email,
				password,
				role: "client",
			});

			await this.userRepository.update(userToUpdate);
		} catch (error: any) {
			throw error;
		}
	}
}
