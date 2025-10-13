import { useAuth } from "@/context/auth-context";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Options() {
  const router = useRouter();

  const { signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showComingSoon = (title: string) => {
    setModalTitle(title);
    setModalMessage(
      "Opción no disponible (de momento). Nuestro brillante equipo de programadores está trabajando duramente para poder ofrecerte esta funcionalidad en breve. Disculpa las molestias."
    );
    setModalVisible(true);
  };

  const menuItems = [
    {
      title: "Bitcoin",
      icon: <FontAwesome5 name="bitcoin" size={24} color="orange" />,
      action: () => router.push("/screens/bitcoin-value"),
    },
    {
      title: "Buscar transacción",
      icon: <MaterialIcons name="search" size={24} color="blue" />,
      action: () => showComingSoon("Buscar transacción"),
    },
    {
      title: "Histórico por meses",
      icon: <MaterialIcons name="calendar-month" size={24} color="green" />,
      action: () => showComingSoon("Histórico por meses"),
    },
    {
      title: "Calcular gasto por día",
      icon: <MaterialIcons name="calculate" size={24} color="purple" />,
      action: () => showComingSoon("Calcular gasto por día"),
    },
    {
      title: "Ver estadísticas por tipo de gasto",
      icon: <MaterialIcons name="bar-chart" size={24} color="teal" />,
      action: () => router.push("/screens/expenses-by-category"),
    },
    {
      title: "Salir de la app",
      icon: <MaterialIcons name="logout" size={24} color="white" />,
      action: signOut,
      buttonColor: "black",
      textColor: "white",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {menuItems.map((item) => (
          <Pressable
            key={item.title}
            style={[
              styles.button,
              { backgroundColor: item.buttonColor || "#f5f5f5" },
            ]}
            onPress={item.action}
          >
            <View style={styles.row}>
              {item.icon}
              <Text
                style={[
                  styles.buttonText,
                  { color: item.textColor || "black", marginLeft: 12 },
                ]}
              >
                {item.title}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Modal para opciones pendientes */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <MaterialIcons name="info" size={40} color="#007AFF" />
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  button: {
    width: "90%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
