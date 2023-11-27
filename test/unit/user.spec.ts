import { UserRepository } from "../../src/application/repositories/user-repository";
import { GetAllUsersUseCase } from "../../src/application/use-cases/user-use-case/get-all-users-use-case";
import { GetUserByEmailUseCase } from "../../src/application/use-cases/user-use-case/get-user-by-email-use-case";
import { GetUserUseCase } from "../../src/application/use-cases/user-use-case/get-user-use-case";
import { prisma } from "../../src/infra/database/prisma";
import { UserRepositoryImpl } from "../../src/infra/database/repositories/user-repository-impl";

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
			"6e161850-e0bf-4a13-8417-212dd796be2a",
		);

		expect(response?.role).toBe("master");
	});

	it("should get one user by email", async () => {
		const response = await getUserByEmailUseCase.execute(
			"raphaeltiago02@gmail.com",
		);

		expect(response?.id).toBe("6e161850-e0bf-4a13-8417-212dd796be2a");
	});
});
