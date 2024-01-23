import { Note } from "../../../domain/note";
import { CreateNoteSchema, UpdateNoteSchema } from "../../adapters/note";
import { NoteRepository } from "../../repositories/note-repository";

export class UpdateNoteUseCase {
	constructor(private noteRepository: NoteRepository) {}

	async execute(note: UpdateNoteSchema & CreateNoteSchema): Promise<void> {
		try {
			const noteToUpdate = new Note(note);

			await this.noteRepository.update(noteToUpdate);
		} catch (error: any) {
			throw error;
		}
	}
}
