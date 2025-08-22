import { useAuth } from "@/context/auth-context";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Options() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Salir de la app</Text>
      </Pressable>
      <Text>De momento es lo que hay</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 12,
    backgroundColor: "black",
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
