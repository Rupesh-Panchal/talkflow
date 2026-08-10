import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Image, StatusBar, } from 'react-native';
import { authService } from '@/services/authService';
import { useRouter } from 'expo-router';
import { styles } from './styles';

const RegisterScreen = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !phoneNumber || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        
        try {
            await authService.register({ username, email, phone_number: phoneNumber, password, });
            Alert.alert(
                'Success',
                'Registration successful! Please login.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/login'),
                    },
                ]
            );
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Registration failed. Please try again.';
            Alert.alert('Registration Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Image source={require('@/assets/logo.png')} style={styles.logo} resizeMode="contain"/>
                    <Text style={styles.title}>TalkFlow</Text>
                    <Text style={styles.subtitle}>Fast, Secure & Private Messaging</Text>
                </View>

                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#94A3B8" value={username} onChangeText={setUsername} autoCapitalize="none" />

                    <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#94A3B8" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} />

                    <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#94A3B8" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />

                    <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#94A3B8" secureTextEntry value={password} onChangeText={setPassword} />

                    <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#94A3B8" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" size="large" />
                        ) : (
                            <Text style={styles.buttonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>
                    Already have an account?{' '}
                    <Text style={styles.loginLink} onPress={() => router.push('/login')}>
                        Sign In
                    </Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;