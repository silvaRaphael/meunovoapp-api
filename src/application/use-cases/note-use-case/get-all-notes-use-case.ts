import { Note } from "../../../domain/note";
import { NoteRepository } from "../../repositories/note-repository";

export class GetAllNotesUseCase {
	constructor(private noteRepository: NoteRepository) {}

	async execute(): Promise<Note[]> {
		try {
			return await this.noteRepository.getAll();
		} catch (error: any) {
			throw error;
		}
	}
}
