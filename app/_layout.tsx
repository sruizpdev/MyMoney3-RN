import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/auth-context";

SplashScreen.setOptions({ duration: 1000, fade: true });
// Mantener splash visible hasta que decidamos ocultarlo
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useAuth();

  // Ocultar splash cuando la sesión haya sido cargada
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

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
