import { User } from "../../../domain/user";
import { CompleteUserSchema } from "../../adapters/user";
import { UserRepository } from "../../repositories/user-repository";

export class CompleteUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute({
		id,
		name,
		email,
		password,
	}: { id: string } & CompleteUserSchema): Promise<void> {
		try {
			const canUpdateUser = await this.userRepository.getOne(id);

			if (canUpdateUser?.password)
				throw new Error("Usuário já cadastrado.");

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
