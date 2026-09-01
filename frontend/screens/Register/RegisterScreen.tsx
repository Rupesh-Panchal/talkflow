import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { authService } from "@/services/authService";
import { useRouter } from "expo-router";
import { styles } from "./styles";

const RegisterScreen = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const handleRegister = async () => {
        setEmailError(false);

        if (!username || !email || !phoneNumber || !password || !confirmPassword) {
            if (!email) setEmailError(true);
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await authService.register({
                username,
                email,
                phone_number: phoneNumber,
                password,
            });
            Alert.alert("Success", "Registration successful! Please login.", [{
                text: "OK",
                onPress: () => router.replace("/login"),
            },]);
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || "Registration failed. Please try again.";
            Alert.alert("Registration Failed", errorMessage);
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
                    <Text style={styles.title}>Create your account</Text>
                    <Text style={styles.subtitle}>Join millions of people on TalkFlow</Text>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    {/* Username */}
                    <Text style={styles.label}>USERNAME</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>👤</Text>
                        <TextInput style={styles.input} placeholder="e.g. alex_walker" placeholderTextColor="#A0AEC0" value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} />
                    </View>

                    {/* Email */}
                    <Text style={styles.label}>EMAIL ADDRESS</Text>
                    <View style={[styles.inputWrapper, emailError && styles.inputWrapperError]}>
                        <Text style={styles.inputIcon}>✉️</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="you@example.com"
                            placeholderTextColor="#A0AEC0"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (emailError) setEmailError(false);
                            }}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                    {emailError && <Text style={styles.errorText}>Email is required</Text>}

                    {/* Phone Number */}
                    <Text style={styles.label}>PHONE NUMBER</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>📞</Text>
                        <TextInput style={styles.input} placeholder="+1 (555) 000-0000" placeholderTextColor="#A0AEC0" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
                    </View>

                    {/* Password */}
                    <Text style={styles.label}>PASSWORD</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>🔒</Text>
                        <TextInput style={styles.input} placeholder="Min. 8 characters" placeholderTextColor="#A0AEC0" secureTextEntry value={password} onChangeText={setPassword} />
                    </View>

                    {/* Confirm Password */}
                    <Text style={styles.label}>CONFIRM PASSWORD</Text>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputIcon}>🔒</Text>
                        <TextInput style={styles.input} placeholder="Re-enter your password" placeholderTextColor="#A0AEC0" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
                    </View>

                    {/* Terms */}
                    <Text style={styles.termsText}>
                        By registering, you agree to TalkFlow's <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>

                    {/* Create Account Button */}
                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
                        {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.buttonText}>Create Account</Text>}
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>
                    Already have an account?{" "}
                    <Text style={styles.loginLink} onPress={() => router.push("/login")}>
                        Sign in
                    </Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;
