import { NoteRepository } from "../../../application/repositories/note-repository";
import { Note } from "../../../domain/note";
import { PrismaType } from "../prisma";

export class NoteRepositoryImpl implements NoteRepository {
	constructor(private database: PrismaType) {}

	async create(note: Note): Promise<void> {
		try {
			await this.database.note.create({
				data: {
					id: note.id,
					user_id: note.user_id,
					title: note.title,
					content: note.content,
					markers: note.markers,
					created_at: note.created_at,
				},
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async update(note: Note): Promise<void> {
		try {
			await this.database.note.update({
				data: {
					title: note.title,
					content: note.content,
					markers: note.markers,
				},
				where: { id: note.id, user_id: note.user_id },
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async delete(filters: { id: string; user_id: string }): Promise<void> {
		try {
			await this.database.note.delete({
				where: { id: filters.id, user_id: filters.user_id },
			});
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getAll(userId: string): Promise<Note[]> {
		try {
			const response = await this.database.note.findMany({
				select: {
					id: true,
					title: true,
					content: true,
					markers: true,
				},
				where: { user_id: userId },
				orderBy: { created_at: "desc" },
			});

			if (!response) return [];

			return response as unknown as Note[];
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}

	async getOne(id: string): Promise<Note | null> {
		try {
			const response = await this.database.note.findFirst({
				select: {
					title: true,
					content: true,
					markers: true,
				},
				where: { id },
				orderBy: { created_at: "desc" },
			});

			if (!response) return null;

			return response as unknown as Note;
		} catch (error: any) {
			throw new Error("DB Error.");
		}
	}
}
