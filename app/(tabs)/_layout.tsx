import { useAuth } from "@/context/auth-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Pressable } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "green",
        headerShown: true,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: "white",
        },
        tabBarStyle: { backgroundColor: "white" },
        headerRight: () => {
          const LogoutButton = () => {
            const { signOut } = useAuth();
            return (
              <Pressable onPress={signOut} style={{ marginRight: 15 }}>
                <Ionicons name="log-out-outline" size={24} color="black" />
              </Pressable>
            );
          };
          return <LogoutButton />;
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="income-form"
        options={{
          title: "Nuevo Ingreso",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="expense-form"
        options={{
          title: "Nuevo Gasto",
          tabBarIcon: ({ color }) => (
            <Ionicons name="remove-circle-outline" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="options"
        options={{
          title: "Opciones",
          tabBarIcon: ({ color }) => (
            <Ionicons name="options" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
