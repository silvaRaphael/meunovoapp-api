import { prisma } from "@db/prisma";
import { UserRepository } from "@repositories/user-repository";
import { UserRepositoryImpl } from "@impl//user-repository-impl";
import { GetAllUsersUseCase } from "@use-cases/user-use-case/get-all-users-use-case";
import { GetUserUseCase } from "@use-cases/user-use-case/get-user-use-case";

describe("User tests", () => {
    let userRepository: UserRepository;

    let getAllUsersUseCase: GetAllUsersUseCase;
    let getUserUseCase: GetUserUseCase;

    beforeAll(() => {
        userRepository = new UserRepositoryImpl(prisma);

        getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
        getUserUseCase = new GetUserUseCase(userRepository);
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
});
