import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/services/authService";
import { styles } from "./styles";

const LoginScreen = () => {
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!identifier.trim() || !password.trim()) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.login({
                identifier,
                password,
            });

            Alert.alert("Success", response.message);

            router.push({
                pathname: "/verify-otp",
                params: { identifier },
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || "Login failed";
            Alert.alert("Login Failed", errorMessage);
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
                    <Text style={styles.title}>Welcome back</Text>
                    <Text style={styles.subtitle}>Sign in to continue to TalkFlow</Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    {/* Email or Phone */}
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

                    {/* Password */}
                    <Text style={styles.label}>PASSWORD</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>🔒</Text>
                        <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="#A0AEC0" secureTextEntry value={password} onChangeText={setPassword} />
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity onPress={() => router.push("/forgot-password")} style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Sign In Button */}
                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
                        {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.buttonText}>Sign In</Text>}
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>
                    Don't have an account?{" "}
                    <Text style={styles.loginLink} onPress={() => router.push("/register")}>
                        Create Account
                    </Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
