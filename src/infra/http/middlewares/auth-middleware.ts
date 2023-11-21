import { tokenSchema } from "@adapters/auth";
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

		const response = await new ValidateTokenUseCase(
			new AuthRepositoryImpl(prisma),
		).execute(parsedToken);

		if (!response?.id) throw new Error("Token expirado.");

		(req as AuthRequest).token = parsedToken;
		(req as AuthRequest).userId = response.id;

		next();
	} catch (error: any) {
		error.name = undefined;
		res.status(401).json({ error });
	}
};
