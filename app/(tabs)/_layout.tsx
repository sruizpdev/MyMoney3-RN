import { colors } from "@/utils/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.p5,
        tabBarInactiveTintColor: colors.p1,
        headerShown: false,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarStyle: {
          backgroundColor: colors.bg,
          height: 100,
        },
        tabBarLabelStyle: { fontSize: 12 },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={30} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-income"
        options={{
          title: "Ingreso",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={30} color={color} /> // <-- aquí
          ),
        }}
      />

      <Tabs.Screen
        name="add-expense"
        options={{
          title: "Añadir Gasto",
          tabBarIcon: ({ color }) => (
            <Ionicons name="remove-circle-outline" size={30} color={color} /> // <-- aquí
          ),
        }}
      />

      <Tabs.Screen
        name="options"
        options={{
          title: "Opciones",
          tabBarIcon: ({ color }) => (
            <Ionicons name="options" size={30} color={color} /> // <-- aquí
          ),
        }}
      />
    </Tabs>
  );
}
