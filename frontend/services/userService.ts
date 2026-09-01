import api from "@/config/api";
import { UserUpdate, UserPasswordUpdate } from "@/types/user";

export const userService = {
	async getMe() {
		const res = await api.get("/users/me");
		return res.data;
	},

	async updateMe(data: UserUpdate) {
		const res = await api.put("/users/me", data);
		return res.data;
	},
	
	async updatePassword(data: UserPasswordUpdate) {
		const res = await api.put("/users/me/password", data);
		return res.data;
	},
	
	async updateAvatar(uri: string, userId: string) {
		const formData = new FormData();
		
		formData.append("file", { uri, name: `avatar_${userId}.jpg`, type: "image/jpeg", } as any);
			const res = await api.put("/users/me/avatar", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		
		return res.data;
	},
	
    async getAllUsers() {
        const res = await api.get("/users/");
        return res.data;
    },

	async searchUsers(q: string) {
		const res = await api.get(`/users/search?q=${q}`);
		return res.data;
	},
	
	async getUserById(userId: string) {
		const res = await api.get(`/users/${userId}`);
		return res.data;
	},
};
