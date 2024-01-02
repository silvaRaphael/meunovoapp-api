import { Router } from "express";
import { prisma } from "../../database/prisma";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { UserPreferencesRepositoryImpl } from "../../database/repositories/user-preferences-repository-impl";
import { UpdateUserPreferencesUseCase } from "../../../application/use-cases/user-preferences-use-case/update-user-preferences-use-case";
import { UserPrefenrecesController } from "../controllers/user-preferences-controller";
import { GetUserPreferencesUseCase } from "../../../application/use-cases/user-preferences-use-case/get-user-preferences-use-case";
import { LanguageMiddleware } from "../middlewares/language-middleware";

const routes = Router();

const userPreferencesRepository = new UserPreferencesRepositoryImpl(prisma);

const updateUserPreferencesUseCase = new UpdateUserPreferencesUseCase(
	userPreferencesRepository,
);
const getUserPreferencesUseCase = new GetUserPreferencesUseCase(
	userPreferencesRepository,
);

const userPreferencesController = new UserPrefenrecesController(
	updateUserPreferencesUseCase,
	getUserPreferencesUseCase,
);

routes.get("/", LanguageMiddleware, AuthMiddleware, (req, res) => {
	userPreferencesController.getUserPreferences(req, res);
});

routes.put("/", LanguageMiddleware, AuthMiddleware, (req, res) => {
	userPreferencesController.updateUserPreferences(req, res);
});

export default routes;
