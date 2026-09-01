import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { conversationService } from "@/services/conversationService";
import { userService } from "@/services/userService";
import { styles } from "./styles";

interface SearchUser {
    id: string;
    username: string;
    avatar_url: string | null;
    is_online: boolean;
}

const UserSearchScreen = () => {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAllUsers = useCallback(async () => {
        try {
            setLoading(true);

            const data = await userService.getAllUsers();

            setUsers(data.results || []);
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message ||
                "Failed to load users";

            Alert.alert("Error", errorMessage);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);
    
    const handleSearch = async (text: string) => {
        setQuery(text);

        const searchQuery = text.trim();

        if (!searchQuery) {
            fetchAllUsers();
            return;
        }

        try {
            setLoading(true);

            const data = await userService.searchUsers(searchQuery);

            setUsers(data.results || []);
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || "Failed to search users";

            Alert.alert("Error", errorMessage);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUserPress = async (user: SearchUser) => {
        try {
            setLoading(true);

            const conversation = await conversationService.createConversation({
                receiver_id: user.id
            });

            router.push({
                pathname: "/chat",
                params: {
                    conversationId: conversation.conversation_id,
                    userId: user.id,
                    username: user.username,
                },
            });
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message ||
                "Failed to create conversation";

            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const renderUser = ({ item }: { item: SearchUser }) => {
        return (
            <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item)} activeOpacity={0.7}>
                <View style={styles.avatarContainer}>
                    {item.avatar_url ? (
                        <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}

                    {item.is_online && <View style={styles.onlineIndicator} />}
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.username} numberOfLines={1}>
                        {item.username}
                    </Text>

                    <Text style={styles.status}>{item.is_online ? "Online" : "Offline"}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#7B5CFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                    <Text style={styles.backButtonText}>‹</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>New Conversation</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>⌕</Text>

                <TextInput style={styles.searchInput} value={query} onChangeText={handleSearch} placeholder="Search username, email or phone" placeholderTextColor="#999" autoCapitalize="none" autoCorrect={false} returnKeyType="search" />

                {query.length > 0 && (
                    <TouchableOpacity
                        onPress={() => {
                            setQuery("");
                            fetchAllUsers();
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.clearButton}>×</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Loading */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#7B5CFF" />
                </View>
            )}

            {/* Results */}
            {!loading && users.length > 0 && (
                <FlatList data={users} keyExtractor={(item) => item.id} renderItem={renderUser} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent} />
            )}

            {/* No Results */}
            {!loading && query.trim().length > 0 && users.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>No users found</Text>
                    <Text style={styles.emptyText}>Try searching with another username, email or phone number.</Text>
                </View>
            )}
        </View>
    );
};

export default UserSearchScreen;
