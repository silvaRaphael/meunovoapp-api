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
import { RoleMiddleware } from "../middlewares/role-middleware";
import { UploadFileUseCase } from "../../../application/use-cases/file-use-case/upload-file-use-case";

const routes = Router();

const userRepository = new UserRepositoryImpl(prisma);
const authRepository = new AuthRepositoryImpl(prisma);

const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const signInUseCase = new SignInUseCase(authRepository, userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
const uploadFileUseCase = new UploadFileUseCase();

const userController = new UserController(
	createUserUseCase,
	updateUserUseCase,
	signInUseCase,
	getAllUsersUseCase,
	getUserUseCase,
	getUserByEmailUseCase,
	uploadFileUseCase,
);

routes.post("/", AuthMiddleware, RoleMiddleware, (req, res) => {
	userController.createUser(req, res);
});

routes.put("/complete/:id", (req, res) => {
	userController.completeUser(req, res);
});

routes.put("/:id?", AuthMiddleware, (req, res) => {
	userController.updateUser(req, res);
});

// routes.get("/", AuthMiddleware, RoleMiddleware, (req, res) => {
routes.get("/", (req, res) => {
	userController.getAllUsers(req, res);
});

routes.get("/profile", AuthMiddleware, (req, res) => {
	userController.getProfile(req, res);
});

// routes.get("/:id", AuthMiddleware, RoleMiddleware, (req, res) => {
routes.get("/:id", (req, res) => {
	userController.getUser(req, res);
});

routes.get("/can-update/:id", (req, res) => {
	userController.canUpdate(req, res);
});

routes.post("/can-use-email", AuthMiddleware, (req, res) => {
	userController.canUseEmail(req, res);
});
routes.post("/can-use-email/:id", (req, res) => {
	userController.canUseEmail(req, res);
});

export default routes;
