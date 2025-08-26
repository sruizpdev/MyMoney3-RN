import { StyleSheet } from "react-native";

export const colors = {
    background: "#FFFFFF",
    textPrimary: "#273F4F",
    textSecondary: "#447D9B",
    iconSelected: "#FFCC00",
    danger: "#CB0404",
    success: "#06923E",
    separator: "#F1F1F1",
    backgroundBox: "#E4E4E4",
    iconPressed: "#D7D7D7",
};

export const globalStyles = StyleSheet.create({

    title: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textPrimary
    },

    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.background,
    },

    label: {
        fontSize: 16,
        fontWeight: "500",
        color: colors.textPrimary,
        marginBottom: 5
    },
    text: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: "500",
    },

    input: {
        paddingHorizontal: 10,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: colors.iconPressed,
        borderRadius: 50,
        color: colors.textPrimary,
        backgroundColor: colors.background,
        fontSize: 18

    },
    screenTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 50,
        color: colors.textPrimary,
        textAlign: "center",
        textTransform: 'uppercase'
    },

    button: {
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.textPrimary,
        marginTop: 14,
    },

    divider: {
        height: 1,
        backgroundColor: colors.background,
        marginVertical: 10,
    },
});
