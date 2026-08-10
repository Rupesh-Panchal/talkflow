import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '@/services/authService';
import { styles } from './styles';

const ResetPasswordScreen = () => {
    const router = useRouter();

    const { identifier } = useLocalSearchParams<{
        identifier: string;
    }>();

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {

        if (!otp.trim()) {
            Alert.alert('Error', 'Please enter OTP');
            return;
        }

        if (!newPassword.trim()) {
            Alert.alert('Error', 'Please enter new password');
            return;
        }

        if (!confirmPassword.trim()) {
            Alert.alert('Error', 'Please confirm your password');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);

        try {

            const response = await authService.resetPassword({
                identifier,
                otp,
                new_password: newPassword,
            });

            Alert.alert(
                'Success',
                response.message,
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/login'),
                    },
                ]
            );

        } catch (error: any) {

            const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message ||
                'Password reset failed';

            Alert.alert(
                'Reset Password Failed',
                errorMessage
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                        source={require('@/assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>
                        Reset Password
                    </Text>

                    <Text style={styles.subtitle}>
                        Create your new password
                    </Text>

                    <Text style={styles.identifier}>
                        {identifier}
                    </Text>

                </View>

                <View style={styles.form}>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter OTP"
                        placeholderTextColor="#94A3B8"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otp}
                        onChangeText={setOtp}
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
                        placeholder="Confirm Password"
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
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator
                                color="#fff"
                            />
                        ) : (
                            <Text style={styles.buttonText}>
                                Reset Password
                            </Text>
                        )}
                    </TouchableOpacity>

                </View>

            </ScrollView>

        </KeyboardAvoidingView>
    );
};

export default ResetPasswordScreen;