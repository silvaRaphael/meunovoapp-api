import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { UploadFileUseCase } from "../../../application/use-cases/file-use-case/upload-file-use-case";
import { uploadFileSchema } from "../../../application/adapters/file";

export class FileController {
	constructor(private uploadFileUseCase: UploadFileUseCase) {}

	uploadFile(req: Request, res: Response) {
		try {
			const { fileName, base64 } = uploadFileSchema.parse(req.body);

			const response = this.uploadFileUseCase.execute({
				fileName,
				base64,
			});

			res.status(200).json({
				path: response.path,
			});
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error) });
		}
	}

	getFile(req: Request, res: Response) {
		try {
			const { fullFileName } = req.params;

			const savedDir = "/app/files";

			res.status(200).sendFile(`${savedDir}/${fullFileName}`);
		} catch (error) {
			res.status(404).end();
		}
	}
}
