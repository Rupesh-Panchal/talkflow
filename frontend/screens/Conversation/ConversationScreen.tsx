import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image, RefreshControl, StatusBar } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { conversationService } from "@/services/conversationService";
import { Conversation } from "@/types/conversation";
import { styles } from "./styles";

const ConversationsScreen = () => {
    const router = useRouter();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchConversations = async () => {
        try {
            const data = await conversationService.getConversations();
            setConversations(data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || "Failed to load conversations";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchConversations();
        }, []),
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchConversations();
    };

    const handleConversationPress = (conversation: Conversation) => {
        router.push({
            pathname: "/chat",
            params: {
                conversationId: conversation.conversation_id,
                userId: conversation.user.id,
                username: conversation.user.username,
            },
        });
    };

    const renderConversation = ({ item }: { item: Conversation }) => {
        const user = item.user;

        return (
            <TouchableOpacity style={styles.conversationItem} onPress={() => handleConversationPress(item)} activeOpacity={0.7}>
                <View style={styles.avatarContainer}>
                    {user.avatar_url ? (
                        <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}

                    {user.is_online && <View style={styles.onlineIndicator} />}
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.username} numberOfLines={1}>
                        {user.username}
                    </Text>
                    <Text style={styles.status}>{user.is_online ? "Online" : "Offline"}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7B5CFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#7B5CFF" />

            {/* Purple Header */}
            <View style={styles.header}>
                <View style={styles.logoRow}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoIcon}>💬</Text>
                    </View>
                    <Text style={styles.brandName}>TalkFlow</Text>
                </View>
                <Text style={styles.title}>Chats</Text>
            </View>

            {conversations.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>No conversations yet</Text>
                        <Text style={styles.emptyText}>Start a new conversation to begin chatting.</Text>
                    </View>
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.conversation_id}
                    renderItem={renderConversation}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#7B5CFF" colors={["#7B5CFF"]} />}
                />
            )}

            {/* New Conversation Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/user-search")}
                activeOpacity={0.8}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ConversationsScreen;
