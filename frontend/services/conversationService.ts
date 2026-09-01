// src/services/conversationService.ts

import api from '@/config/api';

import { CreateConversationPayload, CreateConversationResponse, Conversation, } from '@/types/conversation';

export const conversationService = {
	async createConversation(data: CreateConversationPayload): Promise<CreateConversationResponse> {
		const res = await api.post<CreateConversationResponse>('/conversations/', data);
		return res.data;
	},

	async getConversations(): Promise<Conversation[]> {
		const res = await api.get<Conversation[]>('/conversations/');
		return res.data;
	},
};