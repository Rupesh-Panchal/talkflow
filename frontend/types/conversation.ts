export interface CreateConversationPayload {
	receiver_id: string;
}

export interface CreateConversationResponse {
	message: string;
	conversation_id: string;
}

export interface ConversationUser {
	id: string;
	username: string;
	avatar_url: string | null;
	is_online: boolean;
}

export interface Conversation {
	conversation_id: string;
	user: ConversationUser;
}