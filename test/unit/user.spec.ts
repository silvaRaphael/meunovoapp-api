import { prisma } from "@db/prisma";
import { UserRepository } from "@repositories/user-repository";
import { UserRepositoryImpl } from "@impl/user-repository-impl";
import { GetAllUsersUseCase } from "@use-cases/user-use-case/get-all-users-use-case";
import { GetUserUseCase } from "@use-cases/user-use-case/get-user-use-case";
import { GetUserByEmailUseCase } from "@use-cases/user-use-case/get-user-by-email-use-case";

describe("User tests", () => {
	let userRepository: UserRepository;

	let getAllUsersUseCase: GetAllUsersUseCase;
	let getUserUseCase: GetUserUseCase;
	let getUserByEmailUseCase: GetUserByEmailUseCase;

	beforeAll(() => {
		userRepository = new UserRepositoryImpl(prisma);

		getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
		getUserUseCase = new GetUserUseCase(userRepository);
		getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
	});

	it("should get all users", async () => {
		const response = await getAllUsersUseCase.execute();

		expect(response).toHaveLength(1);
	});

	it("should get one user by id", async () => {
		const response = await getUserUseCase.execute(
			"3aeca3f9-584f-458c-8af5-a100f0ab6485",
		);

		expect(response?.role).toBe("admin");
	});

	it("should get one user by email", async () => {
		const response = await getUserByEmailUseCase.execute(
			"raphaeltiago02@gmail.com",
		);

		expect(response?.id).toBe("3aeca3f9-584f-458c-8af5-a100f0ab6485");
	});
});
