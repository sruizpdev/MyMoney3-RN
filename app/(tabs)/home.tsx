import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/auth-context";

export default function Home() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text onPress={signOut}>Sign Out</Text>
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
