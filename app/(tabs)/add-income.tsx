import { addTransaction } from "@/services/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddIncome() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const router = useRouter();

  const handleSave = async () => {
    if (!description || !amount) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    const newIncome = {
      description,
      amount: parseFloat(amount),
      date: date.toISOString().split("T")[0], // YYYY-MM-DD
      type: "income" as const,
    };

    try {
      const saved = await addTransaction(newIncome);

      if (saved && saved.id) {
        // Limpiar campos
        setDescription("");
        setAmount("");
        setDate(new Date());

        // Volver al Home
        router.push("/(tabs)/home");
      } else {
        Alert.alert("Error", "No se pudo guardar el ingreso");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar el ingreso");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Sueldo"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Cantidad (€)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 1200.00"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Fecha</Text>
      <Button
        title={date.toLocaleDateString("es-ES")}
        onPress={() => setShowPicker(true)}
      />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <View style={styles.saveButton}>
        <Button title="Guardar ingreso" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  label: { fontSize: 16, fontWeight: "500", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 6,
  },
  saveButton: { marginTop: 24 },
});
