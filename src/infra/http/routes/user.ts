import { Router } from "express";
import { prisma } from "../../database/prisma";
import { UserRepositoryImpl } from "../../database/repositories/user-repository-impl";
import { CreateUserUseCase } from "../../../application/use-cases/user-use-case/create-user-use-case";
import { UpdateUserUseCase } from "../../../application/use-cases/user-use-case/update-user-use-case";
import { GetAllUsersUseCase } from "../../../application/use-cases/user-use-case/get-all-users-use-case";
import { GetUserUseCase } from "../../../application/use-cases/user-use-case/get-user-use-case";
import { UserController } from "../controllers/user-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";

const routes = Router();

const userRepository = new UserRepositoryImpl(prisma);

const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);

const userController = new UserController(
	createUserUseCase,
	updateUserUseCase,
	getAllUsersUseCase,
	getUserUseCase,
);

routes.post("/", AuthMiddleware, (req, res) => {
	userController.createUser(req, res);
});

routes.put("/:id", AuthMiddleware, (req, res) => {
	userController.updateUser(req, res);
});

routes.get("/", AuthMiddleware, (req, res) => {
	userController.getAllUsers(req, res);
});

routes.get("/:id", AuthMiddleware, (req, res) => {
	userController.getUser(req, res);
});

export default routes;
