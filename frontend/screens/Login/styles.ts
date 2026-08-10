import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A', 
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#94A3B8',
        textAlign: 'center',
        maxWidth: '80%',
    },
    form: {
        width: '100%',
    },
    input: {
        backgroundColor: '#1E2937',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 12,
        padding: 18,
        marginBottom: 16,
        fontSize: 16,
        color: '#F1F5F9',
    },
    button: {
        backgroundColor: '#229ED9', 
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#229ED9',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    footerText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#94A3B8',
        fontSize: 16,
    },
    loginLink: {
        color: '#229ED9',
        fontWeight: '700',
    },
    forgotPassword: {
        color: '#229ED9',
        textAlign: 'right',
        marginBottom: 10,
        fontWeight: '600',
    },
});