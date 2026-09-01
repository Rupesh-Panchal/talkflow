import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
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
            await authService.verifyOTP({ identifier, otp });
            Alert.alert("Success", "Login successful", [
                {
                    text: "OK",
                    onPress: () => router.replace("/conversations"),
                },
            ]);
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
                    <Text style={styles.title}>Verify OTP</Text>
                    <Text style={styles.subtitle}>We've sent a verification code to</Text>
                    <Text style={styles.identifier}>{identifier}</Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    <Text style={styles.label}>ENTER OTP</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>🔢</Text>
                        <TextInput style={styles.input} placeholder="6-digit code" placeholderTextColor="#A0AEC0" keyboardType="number-pad" maxLength={6} value={otp} onChangeText={setOtp} autoCapitalize="none" autoCorrect={false} />
                    </View>

                    {/* Verify Button */}
                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleVerifyOTP} disabled={loading} activeOpacity={0.85}>
                        {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
                    </TouchableOpacity>

                    {/* Resend OTP */}
                    <TouchableOpacity onPress={handleResendOTP} style={styles.resendContainer} activeOpacity={0.7}>
                        <Text style={styles.resendText}>
                            Didn't receive the code? <Text style={styles.resendLink}>Resend OTP</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default VerifyOTPScreen;
