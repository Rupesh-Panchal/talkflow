import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F172A",
	},

	loaderContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#0F172A",
	},

	scrollContainer: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 20,
		paddingBottom: 40,
	},

	header: {
		alignItems: "center",
		marginBottom: 32,
		marginTop: 12,
	},

	avatarContainer: {
		position: "relative",
		marginBottom: 16,
	},

	avatar: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "#1E293B",
		borderWidth: 3,
		borderColor: "#2563EB",
	},

	editAvatarButton: {
		position: "absolute",
		right: 0,
		bottom: 0,
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#2563EB",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#0F172A",
	},

	username: {
		color: "#FFFFFF",
		fontSize: 26,
		fontWeight: "700",
		letterSpacing: 0.3,
	},

	subtitle: {
		color: "#94A3B8",
		fontSize: 15,
		marginTop: 6,
		fontWeight: "500",
	},

	card: {
		backgroundColor: "#1E293B",
		borderRadius: 16,
		paddingVertical: 8,
		paddingHorizontal: 20,
		marginBottom: 28,
		borderWidth: 1,
		borderColor: "#334155",
	},

	row: {
		paddingVertical: 16,
	},

	label: {
		color: "#94A3B8",
		fontSize: 13,
		fontWeight: "500",
		marginBottom: 6,
		letterSpacing: 0.2,
	},

	value: {
		color: "#F8FAFC",
		fontSize: 16,
		fontWeight: "600",
	},

	input: {
		backgroundColor: "#0F172A",
		borderWidth: 1,
		borderColor: "#334155",
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 12,
		color: "#F8FAFC",
		fontSize: 16,
		fontWeight: "500",
	},

	divider: {
		height: 1,
		backgroundColor: "#334155",
	},

	button: {
		height: 56,
		backgroundColor: "#2563EB",
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 14,
	},

	buttonText: {
		color: "#FFFFFF",
		fontWeight: "600",
		fontSize: 16,
		letterSpacing: 0.3,
	},

	cancelButton: {
		height: 56,
		backgroundColor: "transparent",
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 14,
		borderWidth: 1.5,
		borderColor: "#64748B",
	},

	cancelText: {
		color: "#94A3B8",
		fontWeight: "600",
		fontSize: 16,
		letterSpacing: 0.3,
	},

	logoutButton: {
		height: 56,
		backgroundColor: "transparent",
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
		borderWidth: 1.5,
		borderColor: "#DC2626",
	},

	logoutText: {
		color: "#F87171",
		fontWeight: "700",
		fontSize: 16,
		letterSpacing: 0.3,
	},
});