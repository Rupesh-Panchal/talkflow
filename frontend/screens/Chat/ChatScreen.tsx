import React, { useCallback, useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator, Alert, } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { messageService } from "@/services/messageService";
import { Message } from "@/types/message";

import { styles } from "./styles";

const ChatScreen = () => {
    const router = useRouter();
    const { conversationId, userId, username } = useLocalSearchParams<{
        conversationId: string;
        userId: string;
        username: string;
    }>();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const socketRef = useRef<WebSocket | null>(null);

    const loadMessages = useCallback(async () => {
        if (!conversationId) {
            return;
        }

        try {
            setLoading(true);
            const data = await messageService.getMessages(conversationId);
            setMessages(data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || "Failed to load messages";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) return;

        let socket: WebSocket | null = null;

        const connectWebSocket = async () => {
            try {
                socket = await messageService.connectWebSocket(conversationId);

                socketRef.current = socket;

                socket.onopen = () => {
                    console.log("WebSocket connected");

                    socketRef.current?.send(
                        JSON.stringify({
                            type: "ping",
                        })
                    );
                };

                socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        console.log("WebSocket event:", data);

                        if (data.type === "pong") {
                            console.log("WebSocket pong received");
                        }

                        if (data.type === "new_message") {
                            console.log("New message received:", data);
                        }
                    } catch (error) {
                        console.error("Failed to parse WebSocket message:", error);
                    }
                };

                socket.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };

                socket.onclose = (event) => {
                    console.log("WebSocket disconnected:", event.code, event.reason);
                };
            } catch (error) {
                console.error("Failed to connect WebSocket:", error);
            }
        };

        connectWebSocket();

        return () => {
            if (socket) socket.close();
            socketRef.current = null;
        };
    }, [conversationId]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const handleSendMessage = async () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) {
            return;
        }
        if (!conversationId) {
            Alert.alert("Error", "Conversation ID is missing.");
            return;
        }
        if (sending) {
            return;
        }

        try {
            setSending(true);
            await messageService.sendMessage({
                conversation_id: conversationId,
                message: trimmedMessage,
            });

            setMessage("");
            await loadMessages();
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || "Failed to send message";
            Alert.alert("Error", errorMessage);
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMine = item.sender_id !== userId;
        return (
            <View style={[ styles.messageRow, isMine ? styles.myMessageRow : styles.otherMessageRow, ]}>
                <View style={[ styles.messageBubble, isMine ? styles.myMessage : styles.otherMessage, ]}>
                    <Text style={[ styles.messageText, isMine ? styles.myMessageText : styles.otherMessageText, ]}>
                        {item.message}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={ Platform.OS === "ios" ? "padding" : undefined } keyboardVerticalOffset={ Platform.OS === "ios" ? 90 : 0 }>
            <StatusBar barStyle="light-content" backgroundColor="#7B5CFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                    <Text style={styles.backButtonText}>‹</Text>
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Text style={styles.username} numberOfLines={1}>
                        {username || "Chat"}
                    </Text>

                    <Text style={styles.status}>
                        Online
                    </Text>
                </View>
            </View>

            {/* Loading */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
                    <ActivityIndicator size="large" color="#7B5CFF" />
                </View>
            ) : (
                <FlatList data={messages} keyExtractor={(item) => item.message_id} renderItem={renderMessage} contentContainerStyle={ styles.messagesContainer } showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" />
            )}

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={message} onChangeText={setMessage} placeholder="Type a message..." placeholderTextColor="#A0AEC0" multiline maxLength={1000} editable={!sending} />

                <TouchableOpacity style={[styles.sendButton, (!message.trim() || sending) && styles.sendButtonDisabled]} onPress={handleSendMessage} disabled={ !message.trim() || sending } activeOpacity={0.7}>
                    {sending ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.sendButtonText}>➤</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;