import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Image, StatusBar, } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authService } from "@/services/authService";
import { styles } from "./styles";

const VerifyOTPScreen = () => {
	const router = useRouter();

	const { identifier } = useLocalSearchParams<{
		identifier: string;
	}>();

	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);

	const handleVerifyOTP = async () => {
		if (!otp.trim()) {
			Alert.alert("Error", "Please enter OTP");
			return;
		}

		setLoading(true);

		try {
			await authService.verifyOTP({ identifier, otp, });
			Alert.alert("Success", "Login successful", [{ text: "OK", onPress: () => router.replace("/profile"), }]);
		} catch (error: any) {
			const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || "OTP verification failed";
			Alert.alert("Verification Failed", errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleResendOTP = async () => {
		try {
			const response = await authService.resendOTP(identifier);
			Alert.alert("Success", response.message);
		} catch (error: any) {
			const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || "Failed to resend OTP";
			Alert.alert("Error", errorMessage);
		}
	};

	return (
		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#0F172A" />
			<ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
				<View style={styles.header}>
					<Image source={require("@/assets/logo.png")} style={styles.logo} resizeMode="contain"/>
					<Text style={styles.title}>Verify OTP</Text>
					<Text style={styles.subtitle}>We've sent a verification code to</Text>
					<Text style={styles.identifier}>{identifier}</Text>
				</View>

				<View style={styles.form}>
					<TextInput style={styles.input} placeholder="Enter 6-digit OTP" placeholderTextColor="#94A3B8" keyboardType="number-pad" maxLength={6} value={otp} onChangeText={setOtp} autoCapitalize="none" autoCorrect={false} />

					<TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleVerifyOTP} disabled={loading} >
						{loading ? (
							<ActivityIndicator color="#fff" size="large" />
						) : (
							<Text style={styles.buttonText}>Verify OTP</Text>
						)}
					</TouchableOpacity>

					<TouchableOpacity onPress={handleResendOTP}>
						<Text style={styles.resendText}>Resend OTP</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default VerifyOTPScreen;
