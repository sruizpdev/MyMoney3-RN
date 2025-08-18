import { Link } from "expo-router";
import { View } from "react-native";

export default function Login() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/(tabs)/home">Ir a home</Link>
    </View>
  );
}
