import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7FB",
    },

    header: {
        height: 110,
        backgroundColor: "#7B5CFF",
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 18,
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    backButtonText: {
        color: "#FFFFFF",
        fontSize: 38,
        fontWeight: "300",
        lineHeight: 40,
    },

    headerTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
    },

    searchContainer: {
        height: 52,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 16,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },

    searchIcon: {
        fontSize: 25,
        color: "#777",
        marginRight: 10,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#222",
        paddingVertical: 0,
    },

    clearButton: {
        fontSize: 28,
        color: "#888",
        paddingLeft: 10,
    },

    loadingContainer: {
        paddingTop: 25,
        alignItems: "center",
    },

    listContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 30,
    },

    userItem: {
        backgroundColor: "#FFFFFF",
        minHeight: 72,
        borderRadius: 12,
        marginBottom: 10,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
    },

    avatarContainer: {
        width: 52,
        height: 52,
        position: "relative",
        marginRight: 14,
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
        backgroundColor: "#7B5CFF",
        justifyContent: "center",
        alignItems: "center",
    },

    avatarText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },

    onlineIndicator: {
        position: "absolute",
        right: 0,
        bottom: 1,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#22C55E",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },

    userInfo: {
        flex: 1,
        justifyContent: "center",
    },

    username: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
        marginBottom: 4,
    },

    status: {
        fontSize: 13,
        color: "#777",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        paddingBottom: 100,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        textAlign: "center",
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
        lineHeight: 21,
    },
});