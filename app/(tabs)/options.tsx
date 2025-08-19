import { StyleSheet, Text, View } from "react-native";

export default function Options() {
  return (
    <View style={styles.container}>
      <Text>en un futuro aqui habrá más cositas</Text>
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
