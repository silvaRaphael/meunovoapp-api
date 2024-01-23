import { Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { CreateNoteUseCase } from "../../../application/use-cases/note-use-case/create-note-use-case";
import { UpdateNoteUseCase } from "../../../application/use-cases/note-use-case/update-note-use-case";
import { GetAllNotesUseCase } from "../../../application/use-cases/note-use-case/get-all-notes-use-case";
import { GetNoteUseCase } from "../../../application/use-cases/note-use-case/get-note-use-case";
import {
	createNoteSchema,
	updateNoteSchema,
} from "../../../application/adapters/note";
import { AuthRequest } from "../../config/auth-request";
import { DeleteNoteUseCase } from "../../../application/use-cases/note-use-case/delete-note-use-case";
import { UserNotFoundError } from "../../../application/errors";

export class NoteController {
	constructor(
		private createNoteUseCase: CreateNoteUseCase,
		private updateNoteUseCase: UpdateNoteUseCase,
		private deleteNoteUseCase: DeleteNoteUseCase,
		private getAllNotesUseCase: GetAllNotesUseCase,
		private getNoteUseCase: GetNoteUseCase,
	) {}

	async createNote(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;
			const { user_id, title, content, markers } = createNoteSchema.parse(
				{
					...req.body,
					user_id: userId,
				},
			);

			await this.createNoteUseCase.execute({
				user_id,
				title,
				content,
				markers,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async updateNote(req: Request, res: Response) {
		try {
			const { id } = updateNoteSchema.parse(req.params);
			const { userId } = req as AuthRequest;
			const { user_id, title, content, markers } = createNoteSchema.parse(
				{
					...req.body,
					user_id: userId,
				},
			);

			await this.updateNoteUseCase.execute({
				id,
				user_id,
				title,
				content,
				markers,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async deleteNote(req: Request, res: Response) {
		try {
			const { id } = updateNoteSchema.parse(req.params);
			const { userId } = req as AuthRequest;

			if (!userId) throw new UserNotFoundError(req);

			await this.deleteNoteUseCase.execute({
				id,
				user_id: userId,
			});

			res.status(200).send();
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async getAllNotes(req: Request, res: Response) {
		try {
			const { userId } = req as AuthRequest;

			if (!userId) throw new UserNotFoundError(req);

			const response = await this.getAllNotesUseCase.execute(userId);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}

	async getNote(req: Request, res: Response) {
		try {
			const { id } = updateNoteSchema.parse(req.params);

			const response = await this.getNoteUseCase.execute(id);

			res.status(200).json(response);
		} catch (error: any) {
			res.status(401).send({ error: HandleError(error, req) });
		}
	}
}
