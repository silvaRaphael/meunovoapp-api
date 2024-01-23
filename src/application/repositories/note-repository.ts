import { Note } from "../../domain/note";

export interface NoteRepository {
	create(note: Note): Promise<void>;
	update(note: Note): Promise<void>;
	delete(id: string): Promise<void>;
	getAll(): Promise<Note[]>;
	getOne(id: string): Promise<Note | null>;
}
