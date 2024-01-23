import { Note } from "../../../domain/note";
import { NoteRepository } from "../../repositories/note-repository";

export class GetAllNotesUseCase {
	constructor(private noteRepository: NoteRepository) {}

	async execute(userId: string): Promise<Note[]> {
		try {
			return await this.noteRepository.getAll(userId);
		} catch (error: any) {
			throw error;
		}
	}
}
