import { randomUUID } from "node:crypto";

export type ProjectStatus =
	| "waiting"
	| "in progress"
	| "completed"
	| "cancelled";

export const projectStatuses: ProjectStatus[] = [
	"waiting",
	"in progress",
	"completed",
	"cancelled",
];

export interface IProject {
	id?: string;
	client_id: string;
	name: string;
	description?: string;
	status?: ProjectStatus;
	due: Date;
}

export class Project {
	id: string;
	client_id: string;
	name: string;
	description: string | null;
	status: ProjectStatus;
	due: Date;

	constructor({ id, client_id, name, description, status, due }: IProject) {
		this.id = id || randomUUID();
		this.client_id = client_id;
		this.name = name;
		this.description = description || null;
		this.status = status || "waiting";
		this.due = due;
	}
}
