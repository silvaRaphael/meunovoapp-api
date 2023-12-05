import { User } from "../../../domain/user";
import { UpdateUserSchema } from "../../adapters/user";
import { UserRepository } from "../../repositories/user-repository";
import { hashSync } from "bcrypt";

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
			const userToUpdate = {
				id,
				name,
				email,
				avatar,
			} as User;

			if (password) userToUpdate.password = hashSync(password, 8);

			await this.userRepository.update(userToUpdate);
		} catch (error: any) {
			throw error;
		}
	}
}
