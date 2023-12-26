import { randomUUID } from "node:crypto";
import { Status } from "../application/adapters/status";
import { Task } from "./task";

export interface IProject {
	id?: string;
	client_id: string;
	name: string;
	description?: string;
	status?: Status;
	budget?: number;
	tasks?: Task[];
	due: Date;
}

export class Project {
	id: string;
	client_id: string;
	name: string;
	description: string | null;
	status: Status;
	budget: number | null;
	tasks?: Task[];
	due: Date;

	constructor({
		id,
		client_id,
		name,
		description,
		status,
		budget,
		due,
	}: IProject) {
		this.id = id || randomUUID();
		this.client_id = client_id;
		this.name = name;
		this.description = description || null;
		this.budget = budget || null;
		this.status = status || "waiting";
		this.due = due;
	}
}
