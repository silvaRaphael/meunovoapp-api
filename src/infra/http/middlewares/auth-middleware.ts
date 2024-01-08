import { NextFunction, Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { tokenSchema } from "../../../application/adapters/auth";
import { AuthRequest } from "../../config/auth-request";
import { ValidateTokenUseCase } from "../../../application/use-cases/auth-use-case/validate-token-use-case";
import { AuthRepositoryImpl } from "../../database/repositories/auth-repository-impl";
import { prisma } from "../../database/prisma";
import { SessionExpiredError } from "../../../application/errors";

export const AuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { auth } = req.cookies;

	try {
		if (!auth) throw new SessionExpiredError(req);

		const token = tokenSchema.parse(auth);

		const response = await new ValidateTokenUseCase(
			new AuthRepositoryImpl(prisma),
		).execute(token);

		if (!response) throw new SessionExpiredError(req);

		if (response?.token !== token) throw new SessionExpiredError(req);

		(req as AuthRequest).token = token;
		(req as AuthRequest).userEmail = response.email;
		(req as AuthRequest).userRole = response.role;
		(req as AuthRequest).userIsManager = response.is_manager;
		(req as AuthRequest).clientId = response.client_id || undefined;
		(req as AuthRequest).userId = response.id;
		(req as AuthRequest).masterUserId = [
			"6e161850-e0bf-4a13-8417-212dd796be2a",
		];

		next();
	} catch (error: any) {
		res.clearCookie("auth")
			.status(401)
			.send({ error: HandleError(error, req), redirect: "/login" });
	}
};
