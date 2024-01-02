import { HandleError } from "../../http/utils/handle-error";
import { tokenSchema } from "../../../application/adapters/auth";
import { ValidateTokenUseCase } from "../../../application/use-cases/auth-use-case/validate-token-use-case";
import { AuthRepositoryImpl } from "../../database/repositories/auth-repository-impl";
import { prisma } from "../../database/prisma";
import { Socket } from "socket.io";
import { MessageUser } from "../../../domain/message";
import { SessionExpiredError } from "../../../application/errors";

export const WSAuthMiddleware = async (
	socket: Socket,
): Promise<MessageUser | void> => {
	const cookies = socket.client.request.headers.cookie;

	const cookie = cookies
		?.split(";")
		.find((item) => item.trim().startsWith("auth="));

	const auth = cookie?.replace("auth=", "").trim();

	try {
		if (!auth) throw new SessionExpiredError();

		const token = tokenSchema.parse(auth);

		const response = await new ValidateTokenUseCase(
			new AuthRepositoryImpl(prisma),
		).execute(token);

		if (!response) throw new SessionExpiredError();

		if (response?.token !== token) throw new SessionExpiredError();

		return {
			id: response.id,
			name: response?.name || "",
			email: response.email,
			avatar: response.avatar || "",
			is_manager: response.is_manager,
			ws_token: socket.id,
		};
	} catch (error: any) {
		socket.emit("error", {
			error: HandleError(error),
			redirect: "/login",
		});
	}
};
