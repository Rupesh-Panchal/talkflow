import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/services/authService";
import { styles } from "./styles";

const ForgotPasswordScreen = () => {
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!identifier.trim()) {
            Alert.alert("Error", "Please enter your email or phone number");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.forgotPassword({ identifier });

            Alert.alert("Success", response.message, [
                {
                    text: "OK",
                    onPress: () =>
                        router.push({
                            pathname: "/reset-password",
                            params: { identifier },
                        }),
                },
            ]);
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || "Request failed";
            Alert.alert("Forgot Password", errorMessage);
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
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>Enter your registered email or phone number to receive an OTP</Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    <Text style={styles.label}>EMAIL OR PHONE</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>✉️</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="you@example.com or +1 555..."
                            placeholderTextColor="#A0AEC0"
                            value={identifier}
                            onChangeText={setIdentifier}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Send OTP Button */}
                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleForgotPassword} disabled={loading} activeOpacity={0.85}>
                        {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.buttonText}>Send OTP</Text>}
                    </TouchableOpacity>

                    {/* Back to Login */}
                    <TouchableOpacity onPress={() => router.back()} style={styles.backContainer} activeOpacity={0.7}>
                        <Text style={styles.backText}>
                            Remember your password? <Text style={styles.backLink}>Back to Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ForgotPasswordScreen;
