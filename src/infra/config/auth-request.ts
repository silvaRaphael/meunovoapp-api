import { Request } from "express";

export interface AuthRequest extends Request {
	userId?: string;
	userEmail?: string;
	userRole?: string;
	userIsManager?: boolean;
	token?: string;
}
