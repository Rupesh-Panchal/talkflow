import api from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterPayload, LoginPayload, VerifyOTPPayload, ForgotPasswordPayload, ResetPasswordPayload, AuthTokens, } from '@/types/auth';

export const authService = {
	async register(data: RegisterPayload) {
		const res = await api.post('/auth/register', data);
		return res.data;
	},

	async login(data: LoginPayload) {
		const res = await api.post('/auth/login', data);
		return res.data;
	},

	async verifyOTP(data: VerifyOTPPayload): Promise<AuthTokens> {
		const res = await api.post('/auth/verify-otp', data);

		const tokens: AuthTokens = res.data;

		await AsyncStorage.setItem('access_token', tokens.access_token);
		await AsyncStorage.setItem('refresh_token', tokens.refresh_token);

		return tokens;
	},

	async resendOTP(identifier: string) {
		const res = await api.post('/auth/resend-otp', {
			identifier,
		});

		return res.data;
	},

	async forgotPassword(data: ForgotPasswordPayload) {
		const res = await api.post('/auth/forgot-password', data);
		return res.data;
	},

	async resetPassword(data: ResetPasswordPayload) {
		const res = await api.post('/auth/reset-password', data);
		return res.data;
	},

	async logout() {
		await api.post('/auth/logout');

		await AsyncStorage.removeItem('access_token');
		await AsyncStorage.removeItem('refresh_token');
	},

	async refreshToken() {
		const refresh_token = await AsyncStorage.getItem('refresh_token');

		if (!refresh_token) {
			throw new Error('No refresh token');
		}

		const res = await api.put('/auth/refresh-token', {
			refresh_token,
		});

		await AsyncStorage.setItem('access_token', res.data.access_token);

		return res.data.access_token;
	},

	async verifyToken() {
		const res = await api.get('/auth/verify-token');
		return res.data;
	},
};