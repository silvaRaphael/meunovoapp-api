import { NoteRepository } from "../../repositories/note-repository";

export class DeleteNoteUseCase {
	constructor(private noteRepository: NoteRepository) {}

	async execute(filters: { id: string; user_id: string }): Promise<void> {
		try {
			await this.noteRepository.delete(filters);
		} catch (error: any) {
			throw error;
		}
	}
}
