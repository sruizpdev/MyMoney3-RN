import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../utils/supabase";

type SessionData = {
  id: string;
  username: string;
};

type AuthContextType = {
  session: SessionData | null;
  isLoading: boolean;
  signIn: (pin: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión desde AsyncStorage al iniciar
  useEffect(() => {
    const loadSession = async () => {
      const stored = await AsyncStorage.getItem("session");
      if (stored) setSession(JSON.parse(stored));
      setIsLoading(false);
    };
    loadSession();
  }, []);

  // Iniciar sesión con PIN
  const signIn = async (pin: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("id, username")
      .eq("pin", pin)
      .single();

    if (error || !data) {
      return false; // PIN incorrecto
    }

    const sessionData: SessionData = {
      id: data.id,
      username: data.username,
    };

    setSession(sessionData);
    await AsyncStorage.setItem("session", JSON.stringify(sessionData));
    return true;
  };

  // Cerrar sesión
  const signOut = async () => {
    setSession(null);
    await AsyncStorage.removeItem("session");
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
