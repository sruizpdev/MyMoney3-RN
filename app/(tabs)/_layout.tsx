import { useAuth } from "@/context/auth-context";
import { colors } from "@/utils/globalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
                <MaterialCommunityIcons
                  name="exit-run"
                  size={24}
                  color={colors.p3}
                />
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
        name="add-income"
        options={{
          title: "Ingreso",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={30} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="add-expense"
        options={{
          title: "Añadir Gasto",
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
