import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { AuthRepositoryImpl } from "../../database/repositories/auth-repository-impl";
import { UserRepositoryImpl } from "../../database/repositories/user-repository-impl";
import { prisma } from "../../database/prisma";
import { SignInUseCase } from "../../../application/use-cases/auth-use-case/sign-in-use-case";
import { SignOutUseCase } from "../../../application/use-cases/auth-use-case/sign-out-use-case";
import { AuthController } from "../controllers/auth-controller";
import { LanguageMiddleware } from "../middlewares/language-middleware";

const routes = Router();

const authRepository = new AuthRepositoryImpl(prisma);
const userRepository = new UserRepositoryImpl(prisma);

const signInUseCase = new SignInUseCase(authRepository, userRepository);
const signOutUseCase = new SignOutUseCase(authRepository);

const authController = new AuthController(signInUseCase, signOutUseCase);

routes.post("/sign-in", LanguageMiddleware, (req, res) => {
	authController.signIn(req, res);
});

routes.get("/sign-out", LanguageMiddleware, AuthMiddleware, (req, res) => {
	authController.signOut(req, res);
});

export default routes;
