import { randomUUID } from "node:crypto";
import { Status } from "../application/adapters/status";

export interface ITask {
	id?: string;
	project_id: string;
	name: string;
	description?: string;
	status?: Status;
	startDate?: Date;
	endDate?: Date;
}

export class Task {
	id: string;
	project_id: string;
	name: string;
	description: string | null;
	status: Status;
	startDate: Date | null;
	endDate: Date | null;

	constructor({
		id,
		project_id,
		name,
		description,
		status,
		startDate,
		endDate,
	}: ITask) {
		this.id = id || randomUUID();
		this.project_id = project_id;
		this.name = name;
		this.description = description || null;
		this.status = status || "waiting";
		this.startDate = startDate || null;
		this.endDate = endDate || null;
	}
}
