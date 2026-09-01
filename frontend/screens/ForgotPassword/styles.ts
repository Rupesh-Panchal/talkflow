import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FC",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 40,
    },

    // Header
    header: {
        backgroundColor: "#7B5CFF",
        paddingTop: 60,
        paddingBottom: 36,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    logoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
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
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: "rgba(255,255,255,0.85)",
        lineHeight: 22,
    },

    // Form Card
    formCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginTop: -20,
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        color: "#64748B",
        letterSpacing: 0.6,
        marginBottom: 8,
        marginTop: 4,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F5F9",
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#E2E8F0",
        paddingHorizontal: 14,
        marginBottom: 24,
        height: 52,
    },
    inputIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#1E293B",
        paddingVertical: 0,
    },

    // Button
    button: {
        backgroundColor: "#7B5CFF",
        height: 54,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#7B5CFF",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonDisabled: {
        opacity: 0.65,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },

    // Back to Login
    backContainer: {
        marginTop: 24,
        alignItems: "center",
    },
    backText: {
        fontSize: 14,
        color: "#64748B",
    },
    backLink: {
        color: "#7B5CFF",
        fontWeight: "700",
    },
});
