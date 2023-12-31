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
import { getParticipantWSToken } from "./utils/get-participant-ws-token";

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

const chatIds: {
	id: string;
	participants_ws_token: string[];
}[] = [];

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

io.on("connection", (socket) => {
	console.log("con");

	socket.on("getMessages", async (chat_id) => {
		const auth = await WSAuthMiddleware(socket);

		if (!auth) return;

		const myChatIds = chatIds
			.map((item) => {
				return {
					id: item.id,
					participants_ws_token: item.participants_ws_token.filter(
						(item) => !item.includes(socket.id),
					),
				};
			})
			.filter((item) => item.participants_ws_token.length);

		chatIds.splice(0, chatIds.length);

		myChatIds.forEach((item) => chatIds.push(item));

		let chat = chatIds.find((item) => item.id === chat_id);

		const participants_ws_token: string[] = [];

		if (!chat) {
			if (auth.ws_token) participants_ws_token.push(auth.ws_token);

			chatIds.push({
				id: chat_id,
				participants_ws_token: [...participants_ws_token],
			});
		}

		if (chat) {
			const alreadyConnected = chat.participants_ws_token.find(
				(item) => item === auth.ws_token,
			);

			if (!alreadyConnected && auth.ws_token)
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

		const participant_ws_token = getParticipantWSToken(
			chatIds,
			message.chat_id,
			auth,
		);

		if (!participant_ws_token) return;

		io.sockets.sockets.get(participant_ws_token)?.emit("messageRead", {
			...message,
			read: true,
		});
	});

	socket.on(
		"createMessage",
		async (message: Message, receiver_id?: string) => {
			const auth = await WSAuthMiddleware(socket);

			if (!auth) return;

			messageController.createMessage(socket, auth, {
				...message,
				receiver_id,
			});

			const participant_ws_token = getParticipantWSToken(
				chatIds,
				message.chat_id,
				auth,
			);

			if (!participant_ws_token) return;

			io.sockets.sockets
				.get(participant_ws_token)
				?.emit("message", message);
		},
	);

	socket.on("disconnect", () => {
		console.log("dis");

		const newChatIds = chatIds.filter(
			(item) => !item.participants_ws_token.includes(socket.id),
		);

		chatIds.splice(0, chatIds.length);

		newChatIds.forEach((item) => chatIds.push(item));
	});
});
