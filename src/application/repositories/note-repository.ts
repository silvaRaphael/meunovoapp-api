import { Note } from "../../domain/note";

export interface NoteRepository {
	create(note: Note): Promise<void>;
	update(note: Note): Promise<void>;
	delete(filters: { id: string; user_id: string }): Promise<void>;
	getAll(userId: string): Promise<Note[]>;
	getOne(id: string): Promise<Note | null>;
}
