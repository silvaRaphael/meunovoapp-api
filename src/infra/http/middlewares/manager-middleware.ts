import { NextFunction, Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { AuthRequest } from "../../config/auth-request";

export const ManagerMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userRole, userIsManager } = req as AuthRequest;

		if (userRole !== "master") {
			if (!userIsManager)
				throw new Error("Você não tem permissão para esta ação.");
		}

		next();
	} catch (error: any) {
		res.status(401).send({ error: HandleError(error) });
	}
};
