import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FC",
    },

    // Header
    header: {
        backgroundColor: "#7B5CFF",
        paddingTop: 30,
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    logoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    logoCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.25)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    logoIcon: {
        fontSize: 18,
    },
    brandName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    // List
    listContent: {
        paddingTop: 12,
        paddingBottom: 24,
    },

    conversationItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginVertical: 6,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },

    avatarContainer: {
        position: "relative",
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    avatarPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#E0E7FF",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#7B5CFF",
    },
    onlineIndicator: {
        position: "absolute",
        right: 0,
        bottom: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#22C55E",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },

    userInfo: {
        flex: 1,
        marginLeft: 14,
    },
    username: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1E293B",
    },
    status: {
        marginTop: 3,
        fontSize: 13,
        color: "#64748B",
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F9FC",
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    emptyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 32,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
        width: "100%",
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 20,
    },
    addButton: {
        position: "absolute",
        right: 20,
        bottom: 25,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#7B5CFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },

    addButtonText: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "300",
        lineHeight: 36,
    },
});
