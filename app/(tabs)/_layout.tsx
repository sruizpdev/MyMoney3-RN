import { useAuth } from "@/context/auth-context";
import AntDesign from "@expo/vector-icons/AntDesign";
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
        tabBarStyle: {
          backgroundColor: "white",
          height: 110,
        },
        tabBarLabelStyle: { fontSize: 12 },

        headerRight: () => {
          const LogoutButton = () => {
            const { signOut } = useAuth();
            return (
              <Pressable onPress={signOut} style={{ marginRight: 15 }}>
                <Ionicons name="log-out-outline" size={30} color="black" />
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
            <AntDesign name="home" size={30} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="income-form"
        options={{
          title: "Ingreso",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={30} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="expense-form"
        options={{
          title: "Gasto",
          tabBarIcon: ({ color }) => (
            <Ionicons name="remove-circle-outline" size={30} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="options"
        options={{
          title: "Opciones",
          tabBarIcon: ({ color }) => (
            <Ionicons name="options" size={30} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
