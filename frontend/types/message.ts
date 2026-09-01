// src/types/message.ts

export interface SendMessagePayload {
	conversation_id: string;
	message: string;
}

export interface Message {
    message_id: string;
    sender_id: string;
    message: string;
    created_at: string;
}