// utils/theme.ts
import { StyleSheet } from "react-native";

export const colors = {
    green: '#265037ff',
    lightGreen: '#2b7369',
    gray: '#EDEFEF',
    lightGray: '#F8F9FB'
};


export const fontSizes = {
    small: 12,
    medium: 16,
    large: 20,
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.lightGray,
    },
    label: {
        fontSize: fontSizes.medium,
        fontWeight: "400",
        color: '#000000',
        marginTop: 12,
    },
    input: {

        marginBottom: 30,


    },

    button: {
        marginTop: 24,
    },
});
