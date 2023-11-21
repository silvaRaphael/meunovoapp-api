import { tokenSchema } from "src/application/adapters/auth";
import { AuthRequest } from "@config/auth-request";
import { prisma } from "@db/prisma";
import { AuthRepositoryImpl } from "@impl/auth-repository-impl";
import { ValidateTokenUseCase } from "@use-cases/auth-use-case/validate-token-use-case";
import { NextFunction, Request, Response } from "express";

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
		(req as AuthRequest).userId = response.id;

		next();
	} catch (error: any) {
		error.name = undefined;
		res.status(401).json({ error });
	}
};
