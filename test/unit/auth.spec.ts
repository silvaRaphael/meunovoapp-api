import { prisma } from "@db/prisma";
import { UserRepository } from "@repositories/user-repository";
import { UserRepositoryImpl } from "@impl/user-repository-impl";
import { GetAllUsersUseCase } from "@use-cases/user-use-case/get-all-users-use-case";
import { GetUserUseCase } from "@use-cases/user-use-case/get-user-use-case";
import { GetUserByEmailUseCase } from "@use-cases/user-use-case/get-user-by-email-use-case";
import { AuthRepository } from "@repositories/auth-repository";
import { SignInUseCase } from "@use-cases/auth-use-case/sign-in-use-case";
import { SignOutUseCase } from "@use-cases/auth-use-case/sign-out-use-case";
import { AuthRepositoryImpl } from "@impl/auth-repository-impl";

describe("Auth tests", () => {
	let authRepository: AuthRepository;

	let userRepository: UserRepository;

	let signInUseCase: SignInUseCase;
	let signOutUseCase: SignOutUseCase;

	let getAllUsersUseCase: GetAllUsersUseCase;
	let getUserUseCase: GetUserUseCase;
	let getUserByEmailUseCase: GetUserByEmailUseCase;

	let token: string;

	beforeAll(() => {
		authRepository = new AuthRepositoryImpl(prisma);

		userRepository = new UserRepositoryImpl(prisma);

		signInUseCase = new SignInUseCase(authRepository, userRepository);
		signOutUseCase = new SignOutUseCase(authRepository);

		getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
		getUserUseCase = new GetUserUseCase(userRepository);
		getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
	});

	it("should sign in with email and password", async () => {
		const response = await signInUseCase.execute({
			email: "raphaeltiago02@gmail.com",
			password: "MNapp2023@",
		});

		console.log(response.token);

		token = response.token || "";

		expect(response.token).not.toBeNull();
	});

	it("should not sign in with wrong credentials", async () => {
		try {
			await signInUseCase.execute({
				email: "wrong@email.com",
				password: "wrong-password",
			});
		} catch (error: any) {
			expect(error.message).toBe("E-mail não encontrado.");
		}
	});

	it("should sign out", async () => {
		expect(await signOutUseCase.execute(token)).toBeUndefined();
	});
});
