import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authService } from "@/services/authService";
import { styles } from "./styles";

const ResetPasswordScreen = () => {
    const router = useRouter();

    const { identifier } = useLocalSearchParams<{
        identifier: string;
    }>();

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!otp.trim()) {
            Alert.alert("Error", "Please enter OTP");
            return;
        }

        if (!newPassword.trim()) {
            Alert.alert("Error", "Please enter new password");
            return;
        }

        if (!confirmPassword.trim()) {
            Alert.alert("Error", "Please confirm your password");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.resetPassword({
                identifier,
                otp,
                new_password: newPassword,
            });

            Alert.alert("Success", response.message, [
                {
                    text: "OK",
                    onPress: () => router.replace("/login"),
                },
            ]);
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || "Password reset failed";

            Alert.alert("Reset Password Failed", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#7B5CFF" />

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {/* Purple Header */}
                <View style={styles.header}>
                    <View style={styles.logoRow}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoIcon}>💬</Text>
                        </View>
                        <Text style={styles.brandName}>TalkFlow</Text>
                    </View>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>Create a new password for your account</Text>
                    <Text style={styles.identifier}>{identifier}</Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    {/* OTP */}
                    <Text style={styles.label}>OTP CODE</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>🔢</Text>
                        <TextInput style={styles.input} placeholder="6-digit code" placeholderTextColor="#A0AEC0" keyboardType="number-pad" maxLength={6} value={otp} onChangeText={setOtp} autoCapitalize="none" autoCorrect={false} />
                    </View>

                    {/* New Password */}
                    <Text style={styles.label}>NEW PASSWORD</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>🔒</Text>
                        <TextInput style={styles.input} placeholder="Min. 8 characters" placeholderTextColor="#A0AEC0" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
                    </View>

                    {/* Confirm Password */}
                    <Text style={styles.label}>CONFIRM PASSWORD</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>🔒</Text>
                        <TextInput style={styles.input} placeholder="Re-enter new password" placeholderTextColor="#A0AEC0" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
                    </View>

                    {/* Reset Button */}
                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleResetPassword} disabled={loading} activeOpacity={0.85}>
                        {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.buttonText}>Reset Password</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ResetPasswordScreen;
