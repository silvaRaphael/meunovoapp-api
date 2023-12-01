import { randomUUID } from "node:crypto";
import { Status } from "../application/adapters/status";

export interface ITask {
	id?: string;
	project_id: string;
	name: string;
	description?: string;
	status?: Status;
}

export class Task {
	id: string;
	project_id: string;
	name: string;
	description: string | null;
	status: Status;

	constructor({ id, project_id, name, description, status }: ITask) {
		this.id = id || randomUUID();
		this.project_id = project_id;
		this.name = name;
		this.description = description || null;
		this.status = status || "waiting";
	}
}
