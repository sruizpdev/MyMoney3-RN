import { SplashScreen } from "expo-router";
import { useAuth } from "./context/auth-context";

export function SplashScreenController() {
  const { isLoading } = useAuth();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
