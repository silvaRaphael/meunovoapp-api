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
		activated_at,
	}: { id: string } & UpdateUserSchema): Promise<void> {
		try {
			const userToUpdate = {
				id,
				name,
				email,
				avatar,
				password: password ?? undefined,
				activated_at: activated_at ?? undefined,
			} as User;

			await this.userRepository.update(userToUpdate);
		} catch (error: any) {
			throw error;
		}
	}
}
