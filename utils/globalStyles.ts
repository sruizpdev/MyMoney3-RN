import { StyleSheet } from "react-native";

export const colors = {
    bg: "#FFFFFF",    // fondo
    p1: "#273F4F",    // principal
    p2: "#447D9B",    // secundario
    p3: "#EB5B00",    // destacado
    p4: "#D7D7D7",    // neutro / gris
    p5: "#FFCC00",
    p6: "#CB0404",
    p7: "#06923E"
};

export const fontSize = {
    tiny: 12,
    small: 14,
    base: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 22,
};

export const globalStyles = StyleSheet.create({

    title: {
        fontSize: fontSize.base,
        fontWeight: '600',
        color: colors.p1
    },

    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.bg,
    },

    label: {
        fontSize: 16,
        fontWeight: "500",
        color: colors.p1,
        marginBottom: 5
    },
    text: {
        fontSize: 16,
        color: colors.p1,
        fontWeight: "400",
    },
    textBold: {
        fontWeight: "700",
    },
    input: {
        paddingHorizontal: 10,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: colors.p4,
        borderRadius: 50,
        color: colors.p1,
        backgroundColor: colors.bg,
        fontSize: 18

    },
    screenTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 50,
        color: colors.p1,
        textAlign: "center",
        textTransform: 'uppercase'
    },
    // Botones
    button: {
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.p1,
        marginTop: 14,
    },

    divider: {
        height: 1,
        backgroundColor: colors.bg,
        marginVertical: 10,
    },
});
