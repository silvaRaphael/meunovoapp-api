import fs from "node:fs";

export class DeleteFileUseCase {
	execute(filePath: string): void {
		try {
			const saveDir = "/app/files";

			if (!fs.existsSync(`${saveDir}/${filePath}`)) return;

			fs.unlinkSync(`${saveDir}/${filePath}`);
		} catch (error: any) {
			throw error;
		}
	}
}
