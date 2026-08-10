import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { userService } from "@/services/userService";
import { styles } from "./styles";

const ChangePasswordScreen = () => {
    const router = useRouter();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!oldPassword.trim()) {
            Alert.alert("Error", "Please enter your current password");
            return;
        }

        if (!newPassword.trim()) {
            Alert.alert("Error", "Please enter your new password");
            return;
        }

        if (!confirmPassword.trim()) {
            Alert.alert("Error", "Please confirm your new password");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const response = await userService.updatePassword({
                old_password: oldPassword,
                new_password: newPassword,
            });

            Alert.alert(
                "Success",
                response.message,
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message ||
                "Failed to update password";

            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="#0F172A"
            />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Image
                        source={require("@/assets/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>
                        Change Password
                    </Text>

                    <Text style={styles.subtitle}>
                        Update your account password
                    </Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Current Password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <TouchableOpacity
                        style={[
                            styles.button,
                            loading && styles.buttonDisabled,
                        ]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>
                                Change Password
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ChangePasswordScreen;