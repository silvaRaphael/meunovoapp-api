import { NextFunction, Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { tokenSchema } from "../../../application/adapters/auth";
import { AuthRequest } from "../../config/auth-request";

export const AuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { authorization } = req.headers;

	try {
		if (!authorization) throw Error;

		const [, token] = authorization.split("Bearer ");

		if (!token) throw new Error("Token não informado.");

		const parsedToken = tokenSchema.parse(token);

		if (!(req.session as any).user.token)
			throw new Error("Token expirado.");

		const response = (req.session as any).user;

		if (response.token !== token) throw new Error("Token expirado.");

		(req as AuthRequest).token = parsedToken;
		(req as AuthRequest).userEmail = response.email;
		(req as AuthRequest).userId = response.id;

		next();
	} catch (error: any) {
		res.status(400).send({ error: HandleError(error) });
	}
};
