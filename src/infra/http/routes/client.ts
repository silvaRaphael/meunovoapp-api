import { Router } from "express";
import { prisma } from "../../database/prisma";
import { ClientRepositoryImpl } from "../../database/repositories/client-repository-impl";
import { CreateClientUseCase } from "../../../application/use-cases/client-use-case/create-client-use-case";
import { UpdateClientUseCase } from "../../../application/use-cases/client-use-case/update-client-use-case";
import { GetAllClientsUseCase } from "../../../application/use-cases/client-use-case/get-all-clients-use-case";
import { GetClientUseCase } from "../../../application/use-cases/client-use-case/get-client-use-case";
import { ClientController } from "../controllers/client-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { RoleMiddleware } from "../middlewares/role-middleware";
import { ManagerMiddleware } from "../middlewares/manager-middleware";
import { UploadFileUseCase } from "../../../application/use-cases/file-use-case/upload-file-use-case";

const routes = Router();

const clientRepository = new ClientRepositoryImpl(prisma);

const createClientUseCase = new CreateClientUseCase(clientRepository);
const updateClientUseCase = new UpdateClientUseCase(clientRepository);
const getAllClientsUseCase = new GetAllClientsUseCase(clientRepository);
const getClientUseCase = new GetClientUseCase(clientRepository);
const uploadFileUseCase = new UploadFileUseCase();

const clientController = new ClientController(
	createClientUseCase,
	updateClientUseCase,
	getAllClientsUseCase,
	getClientUseCase,
	uploadFileUseCase,
);

routes.post("/", AuthMiddleware, RoleMiddleware, (req, res) => {
	clientController.createClient(req, res);
});

routes.put("/:id", AuthMiddleware, ManagerMiddleware, (req, res) => {
	clientController.updateClient(req, res);
});

routes.get("/", AuthMiddleware, RoleMiddleware, (req, res) => {
	clientController.getAllClients(req, res);
});

routes.get("/:id", AuthMiddleware, RoleMiddleware, (req, res) => {
	clientController.getClient(req, res);
});

export default routes;
