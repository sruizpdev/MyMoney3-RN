import { Text, View } from "react-native";
import { useAuth } from "../../context/auth-context";

export default function Home() {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text onPress={signOut}>Sign Out</Text>
    </View>
  );
}
