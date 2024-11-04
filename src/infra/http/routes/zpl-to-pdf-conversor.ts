import express, { Request, Response, Router } from "express";
import multer from "multer";
import axios from "axios";
import path from "path";
import AdmZip from "adm-zip";

const zplToPdfConversor = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

zplToPdfConversor.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

zplToPdfConversor.post(
	"/upload",
	upload.single("file"),
	(req: Request, res: Response) => uploadFile(req, res),
);

async function uploadFile(req: Request, res: Response) {
	try {
		if (!req.file) {
			return res.status(400).send("No file uploaded.");
		}

		const zip = new AdmZip(req.file.buffer);
		const zipEntries = zip.getEntries();
		const pdfZip = new AdmZip();

		for (const entry of zipEntries) {
			if (
				entry.entryName.endsWith(".zpl") ||
				entry.entryName.endsWith(".txt")
			) {
				const content = entry.getData().toString("utf8");
				const zplChunks = splitZplContent(content, 150000); // 150 KB limite por chunk

				for (const chunk of zplChunks) {
					try {
						const pdfBuffer = await convertZplToPdf(chunk);
						pdfZip.addFile(
							`${entry.entryName
								.replace(".zpl", ".pdf")
								.replace(".txt", ".pdf")}`,
							pdfBuffer,
						);
					} catch (err: any) {
						console.error(
							`Failed to convert chunk of ${entry.entryName}: ${err.message}`,
						);
					}
				}
			}
		}

		const pdfZipBuffer = pdfZip.toBuffer();
		res.set("Content-Type", "application/zip");
		res.set("Content-Disposition", "attachment; filename=converted.zip");
		res.send(pdfZipBuffer);
	} catch (error: any) {
		console.log(error.message);
		return res.status(400).send(error.message);
	}
}

// Função para dividir o conteúdo ZPL em partes de até 150 KB
function splitZplContent(content: string, maxSize: number): string[] {
	const labels = content.split(/(?=\^XA)/); // Separar sempre que encontrar o início de uma nova etiqueta
	const chunks = [];
	let currentChunk = "";

	for (const label of labels) {
		// Verifica se adicionar o próximo label ultrapassaria o limite
		if (Buffer.byteLength(currentChunk + label, "utf8") > maxSize) {
			chunks.push(currentChunk); // Salva o chunk atual
			currentChunk = ""; // Reseta para o próximo bloco
		}
		currentChunk += label; // Adiciona o próximo label ao chunk
	}
	if (currentChunk) chunks.push(currentChunk); // Adiciona o último bloco, se houver
	return chunks;
}

async function convertZplToPdf(zplContent: string): Promise<Buffer> {
	const apiUrl = "http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/";
	return new Promise<Buffer>((resolve, reject) => {
		setTimeout(async () => {
			try {
				const response = await axios.post(apiUrl, zplContent, {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Accept: "application/pdf",
					},
					responseType: "arraybuffer",
				});
				resolve(Buffer.from(response.data));
			} catch (error) {
				reject(error);
			}
		}, 250); // Tempo de espera para respeitar limite de requisições
	});
}

export { zplToPdfConversor };
