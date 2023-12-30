import { MessageUser } from "../../../domain/message";

export function getParticipantWSToken(
	chatIds: {
		id: string;
		participants_ws_token: string[];
	}[],
	chat_id: string,
	auth: MessageUser,
): string | null {
	const chat = chatIds.find((item) => item.id === chat_id);

	if (!chat) return null;

	const participant_ws_token = chat.participants_ws_token.find(
		(item) => item !== auth.ws_token,
	);

	if (!participant_ws_token) return null;

	return participant_ws_token;
}
