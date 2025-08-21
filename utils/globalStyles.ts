// utils/theme.ts
import { StyleSheet } from "react-native";

export const colors = {
    bg: "#FFFFFF",    // fondo
    p1: "#273F4F",    // principal
    p2: "#447D9B",    // secundario
    p3: "#FE7743",    // destacado
    p4: "#D7D7D7",    // neutro / gris
};

export const globalStyles = StyleSheet.create({
    // Contenedores
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
        fontWeight: "400", // peso base normal
    },
    textBold: {
        fontWeight: "700", // seminegrita
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

    // Botones
    button: {
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.p3,
        marginTop: 14,
    },

    divider: {
        height: 1,
        backgroundColor: colors.bg,
        marginVertical: 10,
    },
});
