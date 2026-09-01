import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FC",
    },

    // Header
    header: {
        backgroundColor: "#7B5CFF",
        paddingTop: Platform.OS === "ios" ? 54 : 40,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 4,
    },
    backButtonText: {
        fontSize: 34,
        color: "#FFFFFF",
        lineHeight: 38,
        fontWeight: "300",
    },
    headerInfo: {
        flex: 1,
    },
    username: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    status: {
        marginTop: 2,
        fontSize: 13,
        color: "rgba(255,255,255,0.85)",
    },

    // Messages
    messagesContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
        justifyContent: "flex-end",
    },
    messageRow: {
        width: "100%",
        marginBottom: 12,
    },
    myMessageRow: {
        alignItems: "flex-end",
    },
    otherMessageRow: {
        alignItems: "flex-start",
    },
    messageBubble: {
        maxWidth: "78%",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
    },
    myMessage: {
        backgroundColor: "#7B5CFF",
        borderBottomRightRadius: 6,
    },
    otherMessage: {
        backgroundColor: "#FFFFFF",
        borderBottomLeftRadius: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 21,
    },
    myMessageText: {
        color: "#FFFFFF",
    },
    otherMessageText: {
        color: "#1E293B",
    },

    // Input
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
    },
    input: {
        flex: 1,
        minHeight: 46,
        maxHeight: 120,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: "#F1F5F9",
        color: "#1E293B",
        fontSize: 15,
    },
    sendButton: {
        width: 46,
        height: 46,
        marginLeft: 10,
        borderRadius: 23,
        backgroundColor: "#7B5CFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#7B5CFF",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    sendButtonDisabled: {
        opacity: 0.45,
    },
    sendButtonText: {
        fontSize: 18,
        color: "#FFFFFF",
    },
});
