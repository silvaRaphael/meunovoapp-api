import { Request } from "express";
import { Roles } from "../../domain/user";

export interface AuthRequest extends Request {
	userId?: string;
	userEmail?: string;
	userRole?: Roles;
	userIsManager?: boolean;
	clientId?: string;
	token?: string;
}
