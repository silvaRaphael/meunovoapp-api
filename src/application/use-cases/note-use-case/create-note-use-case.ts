import { Note } from "../../../domain/note";
import { CreateNoteSchema } from "../../adapters/note";
import { NoteRepository } from "../../repositories/note-repository";

export class CreateNoteUseCase {
	constructor(private noteRepository: NoteRepository) {}

	async execute(note: CreateNoteSchema): Promise<{ id: string }> {
		try {
			const noteToCreate = new Note(note);

			await this.noteRepository.create(noteToCreate);

			return { id: noteToCreate.id };
		} catch (error: any) {
			throw error;
		}
	}
}
