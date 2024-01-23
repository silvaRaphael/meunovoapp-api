import { Router } from "express";
import { prisma } from "../../database/prisma";
import { NoteRepositoryImpl } from "../../database/repositories/note-repository-impl";
import { CreateNoteUseCase } from "../../../application/use-cases/note-use-case/create-note-use-case";
import { UpdateNoteUseCase } from "../../../application/use-cases/note-use-case/update-note-use-case";
import { GetAllNotesUseCase } from "../../../application/use-cases/note-use-case/get-all-notes-use-case";
import { GetNoteUseCase } from "../../../application/use-cases/note-use-case/get-note-use-case";
import { NoteController } from "../controllers/note-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { LanguageMiddleware } from "../middlewares/language-middleware";
import { DeleteNoteUseCase } from "../../../application/use-cases/note-use-case/delete-note-use-case";

const routes = Router();

const noteRepository = new NoteRepositoryImpl(prisma);

const createNoteUseCase = new CreateNoteUseCase(noteRepository);
const updateNoteUseCase = new UpdateNoteUseCase(noteRepository);
const deleteNoteUseCase = new DeleteNoteUseCase(noteRepository);
const getAllNotesUseCase = new GetAllNotesUseCase(noteRepository);
const getNoteUseCase = new GetNoteUseCase(noteRepository);

const noteController = new NoteController(
	createNoteUseCase,
	updateNoteUseCase,
	deleteNoteUseCase,
	getAllNotesUseCase,
	getNoteUseCase,
);

routes.post("/", LanguageMiddleware, AuthMiddleware, (req, res) => {
	noteController.createNote(req, res);
});

routes.put("/:id", LanguageMiddleware, AuthMiddleware, (req, res) => {
	noteController.updateNote(req, res);
});

routes.delete("/:id", LanguageMiddleware, AuthMiddleware, (req, res) => {
	noteController.deleteNote(req, res);
});

routes.get("/", LanguageMiddleware, AuthMiddleware, (req, res) => {
	noteController.getAllNotes(req, res);
});

routes.get("/:id", LanguageMiddleware, AuthMiddleware, (req, res) => {
	noteController.getNote(req, res);
});

export default routes;
