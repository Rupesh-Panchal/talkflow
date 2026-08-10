import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
    },

    header: {
        alignItems: 'center',
        marginBottom: 45,
    },

    logo: {
        width: 90,
        height: 90,
        marginBottom: 20,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: '700',
    },

    subtitle: {
        marginTop: 12,
        color: '#94A3B8',
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 22,
    },

    form: {
        width: '100%',
    },

    input: {
        height: 56,
        backgroundColor: '#1E293B',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        color: '#FFFFFF',
        paddingHorizontal: 16,
        marginBottom: 22,
        fontSize: 16,
    },

    button: {
        height: 56,
        backgroundColor: '#2563EB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
    },

    backText: {
        marginTop: 25,
        color: '#38BDF8',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15,
    },

});