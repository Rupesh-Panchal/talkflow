import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StatusBar, KeyboardAvoidingView, Platform, TextInput, } from "react-native";
import { useRouter } from "expo-router";
import { userService } from "@/services/userService";
import { authService } from "@/services/authService";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { BASE_URL } from "@/config/constants";
import { styles } from "./styles";

const ProfileScreen = () => {
	const router = useRouter();

	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [isEditing, setIsEditing] = useState(false);
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

	const loadProfile = async () => {
		try {
			const response = await userService.getMe();
			setUser(response);
			setEmail(response.email || "");
			setPhoneNumber(response.phone_number || "");
			setSelectedImageUri(null);
		} catch (error: any) {
			Alert.alert("Error", error.response?.data?.detail || "Failed to load profile");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProfile();
	}, []);

	const handleLogout = async () => {
		try {
			await authService.logout();
			router.replace("/login");
		} catch {
			Alert.alert("Error", "Logout failed");
		}
	};

	const handlePickImage = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permission.granted) {
			Alert.alert("Permission Required", "Please allow gallery access.");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (result.canceled) return;

		setSelectedImageUri(result.assets[0].uri);
	};

	const handleEdit = () => {
		setEmail(user?.email || "");
		setPhoneNumber(user?.phone_number || "");
		setSelectedImageUri(null);
		setIsEditing(true);
	};

	const handleCancel = () => {
		setEmail(user?.email || "");
		setPhoneNumber(user?.phone_number || "");
		setSelectedImageUri(null);
		setIsEditing(false);
	};

	const handleSave = async () => {
		if (!email.trim()) {
			Alert.alert("Validation", "Email is required");
			return;
		}

		try {
			setSaving(true);

			await userService.updateMe({
				email: email.trim(),
				phone_number: phoneNumber.trim() || undefined,
			});

			if (selectedImageUri && user?.id) {
				const avatarResponse = await userService.updateAvatar(
					selectedImageUri,
					user.id
				);

				setUser((prev: any) => ({
					...prev,
					avatar_url: avatarResponse.avatar_url,
				}));
			}

			Alert.alert("Success", "Profile updated successfully");
			await loadProfile(); 
			setIsEditing(false);
		} catch (error: any) {
			Alert.alert("Error", error.response?.data?.detail || "Failed to update profile");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.loaderContainer}>
				<ActivityIndicator size="large" color="#2563EB" />
			</View>
		);
	}

	const avatarSource = selectedImageUri
		? { uri: selectedImageUri } : user?.avatar_url
		? { uri: `${BASE_URL}${user.avatar_url}` } : require("@/assets/default-avatar.png");

	return (
		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#0F172A" />

			<ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.avatarContainer}>
						<Image source={avatarSource} style={styles.avatar} />

						{/* Pencil only visible while editing */}
						{isEditing && (
							<TouchableOpacity style={styles.editAvatarButton} onPress={handlePickImage} activeOpacity={0.8}>
								<MaterialIcons name="edit" size={18} color="#FFFFFF" />
							</TouchableOpacity>
						)}
					</View>

					<Text style={styles.username}>{user?.username || "User"}</Text>
					<Text style={styles.subtitle}>
						{user?.is_online ? "Online" : "Offline"}
					</Text>
				</View>

				{/* Info Card */}
				<View style={styles.card}>
					{/* Email */}
					<View style={styles.row}>
						<Text style={styles.label}>Email</Text>
						{isEditing ? (
							<TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter email" placeholderTextColor="#64748B" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
						) : (
							<Text style={styles.value}>{user?.email || "-"}</Text>
						)}
					</View>

					<View style={styles.divider} />

					{/* Phone */}
					<View style={styles.row}>
						<Text style={styles.label}>Phone</Text>
						{isEditing ? (
							<TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Enter phone number" placeholderTextColor="#64748B" keyboardType="phone-pad" />
						) : (
							<Text style={styles.value}>{user?.phone_number || "-"}</Text>
						)}
					</View>

					<View style={styles.divider} />

					{/* Status (read-only) */}
					<View style={styles.row}>
						<Text style={styles.label}>Status</Text>
						<Text style={[ styles.value, { color: user?.is_online ? "#22C55E" : "#94A3B8" }, ]}>
							{user?.is_online ? "Online" : "Offline"}
						</Text>
					</View>

					<View style={styles.divider} />

					{/* Last Seen (read-only) */}
					<View style={styles.row}>
						<Text style={styles.label}>Last Seen</Text>
						<Text style={styles.value}>{user?.last_seen || "-"}</Text>
					</View>
				</View>

				{/* Actions */}
				{isEditing ? (
					<>
						<TouchableOpacity style={[styles.button, saving && { opacity: 0.7 }]} onPress={handleSave} activeOpacity={0.85} disabled={saving}>
							{saving ? (
								<ActivityIndicator color="#FFFFFF" />
							) : (
								<Text style={styles.buttonText}>Save Changes</Text>
							)}
						</TouchableOpacity>

						<TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.85} disabled={saving}>
							<Text style={styles.cancelText}>Cancel</Text>
						</TouchableOpacity>
					</>
				) : (
					<>
						<TouchableOpacity style={styles.button} onPress={handleEdit} activeOpacity={0.85}>
							<Text style={styles.buttonText}>Edit Profile</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button} onPress={() => router.push("/change-password")} activeOpacity={0.85}>
                            <Text style={styles.buttonText}>Change Password</Text>
                        </TouchableOpacity>

						<TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
							<Text style={styles.logoutText}>Logout</Text>
						</TouchableOpacity>
					</>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default ProfileScreen;