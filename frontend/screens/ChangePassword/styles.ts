import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 40,
    },

    header: {
        alignItems: "center",
        marginBottom: 40,
    },

    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 15,
        color: "#94A3B8",
        textAlign: "center",
    },

    form: {
        width: "100%",
    },

    input: {
        height: 56,
        backgroundColor: "#1E293B",
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 12,
        paddingHorizontal: 18,
        color: "#FFFFFF",
        fontSize: 16,
        marginBottom: 18,
    },

    button: {
        height: 56,
        backgroundColor: "#2563EB",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
});