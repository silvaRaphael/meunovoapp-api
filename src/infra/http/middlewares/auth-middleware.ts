import { NextFunction, Request, Response } from "express";
import { HandleError } from "../utils/handle-error";
import { tokenSchema } from "../../../application/adapters/auth";
import { AuthRequest } from "../../config/auth-request";
import { ValidateTokenUseCase } from "../../../application/use-cases/auth-use-case/validate-token-use-case";
import { AuthRepositoryImpl } from "../../database/repositories/auth-repository-impl";
import { prisma } from "../../database/prisma";

export const AuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { auth } = req.cookies;

	try {
		if (!auth) throw new Error("Token não informado.");

		const token = tokenSchema.parse(auth);

		const response = await new ValidateTokenUseCase(
			new AuthRepositoryImpl(prisma),
		).execute(token);

		if (!response) throw new Error("Token expirado.");

		if (response?.token !== token) throw new Error("Token expirado.");

		(req as AuthRequest).token = token;
		(req as AuthRequest).userEmail = response.email;
		(req as AuthRequest).userRole = response.role;
		(req as AuthRequest).userIsManager = response.is_manager;
		(req as AuthRequest).clientId = response.client_id || undefined;
		(req as AuthRequest).userId = response.id;

		next();
	} catch (error: any) {
		res.clearCookie("auth")
			.status(401)
			.send({ error: HandleError(error), redirect: "/login" });
	}
};
