// Root.tsx
import { expenseCategories, incomeCategories } from "@/services/category-icons";
import { Stack } from "expo-router";
import React from "react";
import { PaperProvider } from "react-native-paper";
import { AuthProvider, useAuth } from "../context/auth-context";
import { SplashScreenController } from "../splah";

// Función global para renderizar iconos
const globalIcon = ({ name, size, color }: any) => {
  // Primero buscamos en categorías de gasto
  if (expenseCategories[name]) return expenseCategories[name](color, size);
  // Luego en categorías de ingreso
  if (incomeCategories[name]) return incomeCategories[name](color, size);
  // Finalmente usamos el icono de Paper por defecto
  const { MaterialCommunityIcons } = require("@expo/vector-icons");
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
};

export default function Root() {
  return (
    <PaperProvider
      settings={{
        icon: globalIcon,
      }}
    >
      <AuthProvider>
        <SplashScreenController />
        <RootNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}

function RootNavigator() {
  const { session } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}
