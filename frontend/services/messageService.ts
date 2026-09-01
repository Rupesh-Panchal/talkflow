import api from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WS_BASE_URL } from '@/config/constants';
import { SendMessagePayload, Message } from '@/types/message';

export const messageService = {
	async sendMessage(data: SendMessagePayload) {
		const res = await api.post('/messages/', data);
		return res.data;
	},

	async getMessages(conversation_id: string): Promise<Message[]> {
		const res = await api.get<Message[]>(`/messages/${conversation_id}`);
		return res.data;
	},

	async connectWebSocket(conversation_id: string): Promise<WebSocket> {
		const accessToken = await AsyncStorage.getItem('access_token');

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const url = `${WS_BASE_URL}/ws/chat/${conversation_id}` + `?token=${encodeURIComponent(accessToken)}`;
        
		return new WebSocket(url);
	},
};