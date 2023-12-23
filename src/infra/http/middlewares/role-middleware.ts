import { NextFunction, Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { AuthRequest } from "../../config/auth-request";

export const RoleMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userRole } = req as AuthRequest;

		if (userRole !== "master") {
			throw new Error("Sem permissão.");
		}

		next();
	} catch (error: any) {
		res.status(401).send({ error: HandleError(error), redirect: "/login" });
	}
};
