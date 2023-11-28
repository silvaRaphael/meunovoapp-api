import { Router } from "express";
import { prisma } from "../../database/prisma";
import { UserRepositoryImpl } from "../../database/repositories/user-repository-impl";
import { CreateUserUseCase } from "../../../application/use-cases/user-use-case/create-user-use-case";
import { UpdateUserUseCase } from "../../../application/use-cases/user-use-case/update-user-use-case";
import { GetAllUsersUseCase } from "../../../application/use-cases/user-use-case/get-all-users-use-case";
import { GetUserUseCase } from "../../../application/use-cases/user-use-case/get-user-use-case";
import { UserController } from "../controllers/user-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { SignInUseCase } from "../../../application/use-cases/auth-use-case/sign-in-use-case";
import { AuthRepositoryImpl } from "../../database/repositories/auth-repository-impl";
import { GetUserByEmailUseCase } from "../../../application/use-cases/user-use-case/get-user-by-email-use-case";

const routes = Router();

const userRepository = new UserRepositoryImpl(prisma);
const authRepository = new AuthRepositoryImpl(prisma);

const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const signInUseCase = new SignInUseCase(authRepository, userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);

const userController = new UserController(
	createUserUseCase,
	updateUserUseCase,
	signInUseCase,
	getAllUsersUseCase,
	getUserUseCase,
	getUserByEmailUseCase,
);

routes.post("/", AuthMiddleware, (req, res) => {
	userController.createUser(req, res);
});

routes.put("/complete/:id", (req, res) => {
	userController.completeUser(req, res);
});

routes.put("/:id?", AuthMiddleware, (req, res) => {
	userController.updateUser(req, res);
});

routes.get("/", AuthMiddleware, (req, res) => {
	userController.getAllUsers(req, res);
});

routes.get("/:id", AuthMiddleware, (req, res) => {
	userController.getUser(req, res);
});

routes.get("/can-update/:id", (req, res) => {
	userController.canUpdate(req, res);
});

routes.post("/can-use-email", AuthMiddleware, (req, res) => {
	userController.canUseEmail(req, res);
});

export default routes;
