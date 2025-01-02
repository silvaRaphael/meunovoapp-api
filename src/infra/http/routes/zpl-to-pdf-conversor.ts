import { Request, Response, Router } from "express";
import multer from "multer";
import axios from "axios";
import path from "node:path";
import AdmZip from "adm-zip";
import archiver from "archiver";
import { PDFDocument } from "pdf-lib";

const zplToPdfConversor = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const queueIds: Record<
	string,
	{
		labels: number;
		time: number;
	}
> = {};

zplToPdfConversor.get("/", (_, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

zplToPdfConversor.post(
	"/upload",
	upload.single("file"),
	(req: Request, res: Response) => uploadFile(req, res),
);

zplToPdfConversor.get("/status/:id", async (req: Request, res: Response) => {
	const { labels, time } = queueIds[req.params.id] ?? { labels: 0, time: 0 };

	delete queueIds[req.params.id];

	res.json({
		labels,
		time,
	});
});

async function uploadFile(req: Request, res: Response) {
	try {
		if (!req.file) {
			return res.status(400).send("No file uploaded.");
		}

		const zip = new AdmZip(req.file.buffer);
		const zipEntries = zip.getEntries();

		const zplLabels: any[] = [];
		for (const entry of zipEntries) {
			if (
				entry.entryName.endsWith(".zpl") ||
				entry.entryName.endsWith(".txt")
			) {
				const content = entry.getData().toString("utf8");
				const labels = content
					.split(/(?=~DGR:)/)
					.filter(
						(label) => label.trim() !== "" && label.trim() !== '"',
					)
					.map((label) => `${label.replace("\n", "")}^XZ`);

				labels.forEach((label, index) => {
					const labelName = `${entry.entryName.replace(
						/(\.zpl|\.txt)$/,
						"",
					)}_part${index + 1}.pdf`;
					zplLabels.push({ index, labelName, label });
				});
			}
		}

		queueIds[req.body.id] = {
			labels: zplLabels.length,
			time: zplLabels.length / 2.5,
		};

		// Processa cada etiqueta ZPL isoladamente, respeitando o limite de taxa
		const pdfBuffers = await processLabelsWithRateLimit(zplLabels, 1, 200);

		const unitePdfs = req.body.unite;

		if (Number(unitePdfs)) {
			await sendAllPdfsInSingleZip(pdfBuffers, res);
		} else {
			await sendAllPdfsSeparatedZip(pdfBuffers, res);
		}
	} catch (error: any) {
		console.log(error.message);
		return res.status(400).send(error.message);
	}
}

async function sendAllPdfsInSingleZip(
	pdfBuffers: {
		labelName: string;
		pdfBuffer: Buffer;
	}[],
	res: Response,
) {
	const combinedPdfBuffer = await combinePDFs(pdfBuffers);

	// Crie um stream para o ZIP
	const zipArchive = archiver("zip", { zlib: { level: 9 } });
	const chunks: any[] = [];

	// Coletar dados de buffer à medida que o ZIP é criado
	zipArchive.on("data", (chunk) => chunks.push(chunk));

	// Adiciona o PDF combinado no ZIP
	zipArchive.append(Buffer.from(combinedPdfBuffer), {
		name: "combined.pdf",
	});

	// Finaliza o ZIP
	await zipArchive.finalize();

	// Após finalizar, combine os chunks em um único buffer e envie a resposta
	const zipBuffer = Buffer.concat(chunks);

	res.set("Content-Type", "application/zip");
	res.set("Content-Disposition", "attachment; filename=converted.zip");
	res.send(zipBuffer);
}

async function sendAllPdfsSeparatedZip(
	pdfBuffers: {
		labelName: string;
		pdfBuffer: Buffer;
	}[],
	res: Response,
) {
	const combinedPdfBuffer = await combinePDFs(pdfBuffers);

	// Valide o PDF combinado antes de adicionar ao ZIP
	if (combinedPdfBuffer.toString() !== "%PDF-") {
		throw new Error("Invalid PDF format.");
	}

	// Crie um stream para o ZIP
	const zipArchive = archiver("zip", { zlib: { level: 9 } });
	const chunks: Buffer[] = [];

	zipArchive.on("data", (chunk) => chunks.push(chunk));

	// Adiciona o PDF combinado no ZIP
	zipArchive.append(combinedPdfBuffer as any, { name: "combined.pdf" });

	// Finaliza o ZIP
	await zipArchive.finalize();

	// Combine os chunks em um único buffer
	const zipBuffer = Buffer.concat(chunks);

	// Envie o arquivo ZIP como resposta
	res.set("Content-Type", "application/zip");
	res.set("Content-Disposition", "attachment; filename=converted.zip");
	res.send(zipBuffer);
	// const pdfZip = new AdmZip();

	// for (const { labelName, pdfBuffer } of pdfBuffers) {
	// 	pdfZip.addFile(labelName, pdfBuffer);
	// }

	// const pdfZipBuffer = pdfZip.toBuffer();
	// res.set("Content-Type", "application/zip");
	// res.set("Content-Disposition", "attachment; filename=converted.zip");
	// res.send(pdfZipBuffer);
}

async function combinePDFs(
	pdfBuffers: {
		labelName: string;
		pdfBuffer: Buffer;
	}[],
) {
	const combinedPdf = await PDFDocument.create();

	// Iterando sobre o array de buffers de PDF
	for (const { pdfBuffer } of pdfBuffers) {
		// Carregando cada PDF individual
		const pdfDoc = await PDFDocument.load(pdfBuffer);

		// Copiando todas as páginas do PDF carregado para o novo documento combinado
		const copiedPages = await combinedPdf.copyPages(
			pdfDoc,
			pdfDoc.getPageIndices(),
		);

		// Adicionando as páginas copiadas ao documento combinado
		copiedPages.forEach((page) => combinedPdf.addPage(page));
	}

	// Retornando o buffer do PDF combinado
	return await combinedPdf.save();
}

async function convertZplToPdf(zplContent: string): Promise<Buffer> {
	const apiUrl = "http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/";

	try {
		const response = await axios.post(apiUrl, zplContent, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/pdf",
			},
			responseType: "arraybuffer",
		});
		return Buffer.from(response.data);
	} catch (error: any) {
		const errorDetails = error.response?.data
			? `Error details: ${error.response.data.toString()}`
			: error.message;

		console.error(
			`Error converting ZPL to PDF for content: ${zplContent.substring(
				0,
				20,
			)}\n${errorDetails}`,
		);
		throw new Error(`Failed to convert ZPL to PDF: ${errorDetails}`);
	}
}

async function processLabelsWithRateLimit(
	labels: { labelName: string; label: string }[],
	batchSize: number,
	delayMs: number,
): Promise<{ labelName: string; pdfBuffer: Buffer }[]> {
	const results: { labelName: string; pdfBuffer: Buffer }[] = [];
	let currentIndex = 0;

	while (currentIndex < labels.length) {
		const batch = labels.slice(currentIndex, currentIndex + batchSize);
		const batchResults = await Promise.all(
			batch.map(async ({ labelName, label }) => {
				try {
					const pdfBuffer = await convertZplToPdf(label);
					return { labelName, pdfBuffer };
				} catch (error: any) {
					console.error(
						`Failed to convert ${labelName} - ${label.length}: ${error.message}`,
					);
					return {
						labelName,
						pdfBuffer: Buffer.from(
							`Failed to convert ${labelName}: ${error.message}`,
						),
					};
				}
			}),
		);
		results.push(...batchResults);
		currentIndex += batchSize;

		// Ajuste do atraso para evitar ultrapassar o limite de requisições
		await new Promise((resolve) => setTimeout(resolve, delayMs));
	}
	return results;
}

export { zplToPdfConversor };
