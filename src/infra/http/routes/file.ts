import { Router } from "express";
import { FileController } from "../controllers/file-controller";
import { UploadFileUseCase } from "../../../application/use-cases/file-use-case/upload-file-use-case";
import { AuthMiddleware } from "../middlewares/auth-middleware";

const routes = Router();

const uploadFileUseCase = new UploadFileUseCase();

const fileController = new FileController(uploadFileUseCase);

routes.post("/upload", AuthMiddleware, (req, res) => {
	fileController.uploadFile(req, res);
});

routes.get("/:fullFileName", (req, res) => {
	fileController.getFile(req, res);
});

export default routes;
