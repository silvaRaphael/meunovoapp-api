import { Server } from "socket.io";
import { server } from "../http";
import { wsAllowedOrigins } from "../config/allowed-origins";
import { WSAuthMiddleware } from "./middlewares/ws-auth-middleware";
import { WSMessageController } from "./controllers/message-controller";
import { MessageRepositoryImpl } from "../database/repositories/message-repository-impl";
import { prisma } from "../database/prisma";
import { ChatRepositoryImpl } from "../database/repositories/chat-repository-impl";
import { CreateMessageUseCase } from "../../application/use-cases/message-use-case/create-message-use-case";
import { CreateChatUseCase } from "../../application/use-cases/chat-use-case/create-chat-use-case";
import { GetChatUseCase } from "../../application/use-cases/chat-use-case/get-chat-use-case";
import { MarkAsReadMessageUseCase } from "../../application/use-cases/message-use-case/mark-as-read-message-use-case";
import { GetAllMessagesUseCase } from "../../application/use-cases/message-use-case/get-all-message-use-case";
import { Message } from "../../domain/message";
import { getOnlineParticipantWSToken } from "./utils/get-participant-ws-token";
import { UserRepositoryImpl } from "../database/repositories/user-repository-impl";
import { UpdateUserWSTokenUseCase } from "../../application/use-cases/user-use-case/update-ws-token-user-use-case";
import { GetUserUseCase } from "../../application/use-cases/user-use-case/get-user-use-case";

const io = new Server(server, {
	cors: {
		origin(origin, callback) {
			const isAllowed = wsAllowedOrigins.find(
				(allowedOrigin) => origin && origin.startsWith(allowedOrigin),
			);

			if (isAllowed) callback(null, true);

			if (!isAllowed) callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
	},
});

const onlineChatIds: {
	id: string;
	participants_ws_token: string[];
}[] = [];

const userRepository = new UserRepositoryImpl(prisma);

const updateUserWSTokenUseCase = new UpdateUserWSTokenUseCase(userRepository);

const messageRepository = new MessageRepositoryImpl(prisma);
const chatRepository = new ChatRepositoryImpl(prisma);

const createMessageUseCase = new CreateMessageUseCase(messageRepository);
const createChatUseCase = new CreateChatUseCase(chatRepository);
const getChatUseCase = new GetChatUseCase(chatRepository);
const markAsReadMessageUseCase = new MarkAsReadMessageUseCase(
	messageRepository,
);
const getAllMessagesUseCase = new GetAllMessagesUseCase(messageRepository);

const messageController = new WSMessageController(
	createMessageUseCase,
	createChatUseCase,
	getChatUseCase,
	markAsReadMessageUseCase,
	getAllMessagesUseCase,
);

io.on("connection", async (socket) => {
	const auth = await WSAuthMiddleware(socket);

	if (!auth) return;

	const { ws_token } = await updateUserWSTokenUseCase.execute({
		user_id: auth.id,
		ws_token: auth.ws_token,
	});

	socket.on("getMessages", async (chat_id) => {
		const auth = await WSAuthMiddleware(socket);

		if (!auth) return;

		const myOnlineChatIds = onlineChatIds
			.map((item) => {
				return {
					id: item.id,
					participants_ws_token: item.participants_ws_token.filter(
						(item) => !item.includes(socket.id),
					),
				};
			})
			.filter((item) => item.participants_ws_token.length);

		onlineChatIds.splice(0, onlineChatIds.length);

		myOnlineChatIds.forEach((item) => onlineChatIds.push(item));

		let chat = onlineChatIds.find((item) => item.id === chat_id);

		const participants_ws_token: string[] = [];

		if (!chat) {
			if (auth.ws_token) participants_ws_token.push(auth.ws_token);

			onlineChatIds.push({
				id: chat_id,
				participants_ws_token: [...participants_ws_token],
			});
		}

		if (chat) {
			const alreadyConnected = chat.participants_ws_token.find(
				(item) => item === auth.ws_token,
			);

			if (!alreadyConnected)
				chat.participants_ws_token.push(auth.ws_token);
		}

		messageController.getMessages(socket, chat_id);
	});

	socket.on("markAsRead", async (message: Message) => {
		const auth = await WSAuthMiddleware(socket);

		if (!auth) return;

		if (message.user?.id) {
			messageController.markAsRead(socket, {
				chat_id: message.chat_id,
				user_id: message.user?.id,
			});
		}

		const participant_ws_token = getOnlineParticipantWSToken(
			onlineChatIds,
			message.chat_id,
			auth,
		);

		if (!participant_ws_token) return;

		io.sockets.sockets.get(participant_ws_token)?.emit("messageRead");
	});

	socket.on(
		"createMessage",
		async (message: Message, receiver_id?: string) => {
			const auth = await WSAuthMiddleware(socket);

			if (!auth) return;

			const messageCreated = messageController.createMessage(
				socket,
				auth,
				{
					...message,
					receiver_id,
				},
			);

			const participant_ws_token = getOnlineParticipantWSToken(
				onlineChatIds,
				message.chat_id,
				auth,
			);

			if (participant_ws_token) {
				io.sockets.sockets.get(participant_ws_token)?.emit("message", {
					...message,
					read: true,
				});
			} else {
				const messageCreatedParticipant = await messageCreated;

				if (!messageCreatedParticipant) return;

				const { participant_id, ws_token } = messageCreatedParticipant;

				if (!participant_id || !ws_token) return;

				io.sockets.sockets
					.get(ws_token)
					?.emit("offlineMessage", message);
			}
		},
	);

	socket.on("logoutChats", () => {
		const newonlineChatIds = onlineChatIds.filter(
			(item) => !item.participants_ws_token.includes(socket.id),
		);

		onlineChatIds.splice(0, onlineChatIds.length);

		newonlineChatIds.forEach((item) => onlineChatIds.push(item));
	});

	socket.on("disconnect", () => {
		updateUserWSTokenUseCase.execute({
			user_id: auth.id,
			ws_token: null,
		});

		const newonlineChatIds = onlineChatIds.filter(
			(item) => !item.participants_ws_token.includes(socket.id),
		);

		onlineChatIds.splice(0, onlineChatIds.length);

		newonlineChatIds.forEach((item) => onlineChatIds.push(item));
	});
});
