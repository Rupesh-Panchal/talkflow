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
        marginBottom: 40,
    },

    logo: {
        width: 90,
        height: 90,
        marginBottom: 20,
    },

    title: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '700',
    },

    subtitle: {
        color: '#94A3B8',
        marginTop: 10,
        fontSize: 15,
        textAlign: 'center',
    },

    identifier: {
        color: '#38BDF8',
        marginTop: 10,
        fontWeight: '600',
        fontSize: 16,
    },

    form: {
        width: '100%',
    },

    input: {
        height: 56,
        backgroundColor: '#1E293B',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 12,
        paddingHorizontal: 16,
        color: '#fff',
        marginBottom: 18,
        fontSize: 16,
    },

    button: {
        height: 56,
        backgroundColor: '#2563EB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 17,
    },

});