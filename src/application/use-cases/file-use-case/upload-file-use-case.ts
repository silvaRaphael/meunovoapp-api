import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { UploadFileSchema } from "../../adapters/file";

export class UploadFileUseCase {
	execute(file: UploadFileSchema): { fileName: string } {
		try {
			const { fileName, base64 } = file;

			const [fileAttributes, fileContent] = base64.split(";base64,");
			const [, fileType] = fileAttributes.split("data:");
			const [, fileExtension] = fileType.split("/");

			const fullFileName = `${fileName || randomUUID()}.${fileExtension}`;

			const saveDir = "/app/files";

			if (!fs.existsSync(saveDir)) {
				fs.mkdirSync(saveDir, { recursive: true });
			}

			const dataBuffer = Buffer.from(fileContent, "base64");

			fs.writeFileSync(`${saveDir}/${fullFileName}`, dataBuffer);

			return { fileName: fullFileName };
		} catch (error: any) {
			throw error;
		}
	}
}
