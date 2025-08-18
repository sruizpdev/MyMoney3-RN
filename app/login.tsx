import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { useAuth } from "../context/auth-context";

export default function SignIn() {
  const [pin, setPin] = useState("");
  const { signIn } = useAuth();

  const handleLogin = async () => {
    const success = await signIn(pin);
    if (success) {
      router.replace("/(tabs)/home"); // ir a pantalla protegida
    } else {
      Alert.alert("PIN incorrecto");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Introduce tu PIN</Text>
      <TextInput
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          width: 100,
          textAlign: "center",
          marginVertical: 10,
        }}
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
