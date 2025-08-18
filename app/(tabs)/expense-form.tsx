import { StyleSheet, Text, View } from "react-native";

export default function ExpenseForm() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de income-form</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // fondo blanco
    justifyContent: "center",
    alignItems: "center",
  },
});
