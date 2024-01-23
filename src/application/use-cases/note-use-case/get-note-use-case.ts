import { Note } from "../../../domain/note";
import { NoteRepository } from "../../repositories/note-repository";

export class GetNoteUseCase {
	constructor(private noteRepository: NoteRepository) {}

	async execute(id: string): Promise<Note | null> {
		try {
			return await this.noteRepository.getOne(id);
		} catch (error: any) {
			throw error;
		}
	}
}
