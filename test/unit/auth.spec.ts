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
import { ValidateTokenUseCase } from "@use-cases/auth-use-case/validate-token-use-case";

describe("Auth tests", () => {
	let authRepository: AuthRepository;

	let userRepository: UserRepository;

	let signInUseCase: SignInUseCase;
	let signOutUseCase: SignOutUseCase;
	let validateTokenUseCase: ValidateTokenUseCase;

	let getAllUsersUseCase: GetAllUsersUseCase;
	let getUserUseCase: GetUserUseCase;
	let getUserByEmailUseCase: GetUserByEmailUseCase;

	let token: string;

	beforeAll(() => {
		authRepository = new AuthRepositoryImpl(prisma);

		userRepository = new UserRepositoryImpl(prisma);

		signInUseCase = new SignInUseCase(authRepository, userRepository);
		signOutUseCase = new SignOutUseCase(authRepository);
		validateTokenUseCase = new ValidateTokenUseCase(authRepository);

		getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
		getUserUseCase = new GetUserUseCase(userRepository);
		getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
	});

	it("should sign in with email and password", async () => {
		const response = await signInUseCase.execute({
			email: "raphaeltiago02@gmail.com",
			password: "MNapp2023@",
		});

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

	it("should validate token", async () => {
		const response = await validateTokenUseCase.execute(token);

		expect(response).not.toBeNull();
	});

	it("should not validate token with wrong token", async () => {
		const response = await validateTokenUseCase.execute("wrong-token");

		expect(response).toBeNull();
	});

	it("should sign out", async () => {
		expect(await signOutUseCase.execute(token)).toBeUndefined();
	});
});
