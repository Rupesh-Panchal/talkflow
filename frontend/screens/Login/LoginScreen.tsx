import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Image, StatusBar, } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services/authService';
import { styles } from './styles';

const LoginScreen = () => {
    const router = useRouter();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!identifier.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.login({
                identifier,
                password,
            });

            Alert.alert('Success', response.message);

            router.push({
                pathname: '/verify-otp',
                params: { identifier, },
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Login failed';
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A"/>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Image source={require('@/assets/logo.png')} style={styles.logo} resizeMode="contain"/>
                    <Text style={styles.title}>TalkFlow</Text>
                    <Text style={styles.subtitle}>Welcome Back</Text>
                </View>

                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Email or Phone Number" placeholderTextColor="#94A3B8" value={identifier} onChangeText={setIdentifier} autoCapitalize="none" autoCorrect={false} />
                    <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#94A3B8" secureTextEntry value={password} onChangeText={setPassword} />
                    <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[ styles.button, loading && styles.buttonDisabled, ]} onPress={handleLogin} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" size="large"/>
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>
                    Don't have an account?{' '}
                    <Text style={styles.loginLink} onPress={() => router.push('/register')}>Create Account</Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;