import { User } from "../../../domain/user";
import { CreateUserSchema } from "../../adapters/user";
import { UserRepository } from "../../repositories/user-repository";

export class CreateUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute({
		email,
		client_id,
		is_manager,
	}: CreateUserSchema): Promise<{ id: string }> {
		try {
			const existentUser = await this.userRepository.getOneByEmail(email);

			if (existentUser?.id) throw new Error("E-mail já em uso.");

			const userToCreate = new User({
				email,
				client_id,
				role: "client",
				is_manager,
				invited_at: new Date(),
			});

			await this.userRepository.create(userToCreate);

			return { id: userToCreate.id };
		} catch (error: any) {
			throw error;
		}
	}
}
