import { NoteRepository } from "../../repositories/note-repository";

export class DeleteNoteUseCase {
	constructor(private noteRepository: NoteRepository) {}

	async execute(id: string): Promise<void> {
		try {
			await this.noteRepository.delete(id);
		} catch (error: any) {
			throw error;
		}
	}
}
