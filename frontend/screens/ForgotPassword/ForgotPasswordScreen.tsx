import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Image, StatusBar, } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services/authService';
import { styles } from './styles';

const ForgotPasswordScreen = () => {
    const router = useRouter();

    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!identifier.trim()) {
            Alert.alert('Error', 'Please enter your email or phone number');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.forgotPassword({ identifier, });

            Alert.alert(
                'Success',
                response.message,
                [
                    {
                        text: 'OK',
                        onPress: () => router.push({
                            pathname: '/reset-password',
                            params: { identifier, },
                        }),
                    },
                ]
            );

        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Request failed';
            Alert.alert('Forgot Password', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Image source={require('@/assets/logo.png')} style={styles.logo} resizeMode="contain" />
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>Enter your registered email or phone number.</Text>
                </View>

                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Email or Phone Number" placeholderTextColor="#94A3B8" value={identifier} onChangeText={setIdentifier} autoCapitalize="none" autoCorrect={false} />
                    <TouchableOpacity style={[ styles.button, loading && styles.buttonDisabled, ]} onPress={handleForgotPassword} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" size="large" />
                        ) : (
                            <Text style={styles.buttonText}>Send OTP</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backText}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ForgotPasswordScreen;