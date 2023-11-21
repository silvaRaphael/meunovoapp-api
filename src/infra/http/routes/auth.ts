import { Router } from "express";
import { prisma } from "@db/prisma";
import { AuthRepositoryImpl } from "@impl/auth-repository-impl";
import { UserRepositoryImpl } from "@impl/user-repository-impl";
import { SignInUseCase } from "@use-cases/auth-use-case/sign-in-use-case";
import { SignOutUseCase } from "@use-cases/auth-use-case/sign-out-use-case";
import { AuthController } from "@controllers/auth-controller";

const routes = Router();

const authRepository = new AuthRepositoryImpl(prisma);
const userRepository = new UserRepositoryImpl(prisma);

const signInUseCase = new SignInUseCase(authRepository, userRepository);
const signOutUseCase = new SignOutUseCase(authRepository);

const authController = new AuthController(signInUseCase, signOutUseCase);

routes.post("/sign-in", (req, res) => {
	authController.signIn(req, res);
});

routes.get("/sign-out/:token", (req, res) => {
	authController.signOut(req, res);
});

export default routes;
