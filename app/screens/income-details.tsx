// IncomeDetails.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Transaction } from "../../interfaces";
import { incomeCategories } from "../../services/category-icons"; // <-- solo ingresos
import {
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../../services/supabase";

export default function IncomeDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("salary");

  useEffect(() => {
    const fetchTransaction = async () => {
      const all = await getTransactions();
      const found = all.find((t) => String(t.id) === id && t.type === "income");
      if (found) {
        setTransaction(found);
        setDescription(found.description);
        setAmount(String(found.amount));
        setDate(new Date(found.date));
        setSelectedCategory(found.category || "salary");
      }
    };
    fetchTransaction();
  }, [id]);

  if (!transaction) return <Text>Cargando...</Text>;

  const handleSave = async () => {
    if (!description || !amount) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const updated = {
      description,
      amount: parseFloat(amount),
      date: date.toISOString().split("T")[0],
      category: selectedCategory,
    };

    try {
      const result = await updateTransaction(String(transaction.id), updated);
      if (result) router.back();
      else Alert.alert("Error", "No se pudo actualizar la transacción");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar la transacción");
    }
  };

  const handleDelete = async () => {
    const confirmed = await new Promise<boolean>((resolve) =>
      Alert.alert(
        "Confirmar eliminación",
        `¿Eliminar este ingreso?\n\nDescripción: ${
          transaction.description
        }\nCantidad: ${transaction.amount} €\nFecha: ${date.toLocaleDateString(
          "es-ES"
        )}`,
        [
          { text: "Cancelar", onPress: () => resolve(false) },
          {
            text: "Eliminar",
            onPress: () => resolve(true),
            style: "destructive",
          },
        ]
      )
    );

    if (!confirmed) return;

    try {
      const success = await deleteTransaction(String(transaction.id));
      if (success) router.back();
      else Alert.alert("Error", "No se pudo eliminar la transacción");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo eliminar la transacción");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Cantidad (€)</Text>
      <TextInput
        style={styles.input}
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

      <Text style={[styles.label, { marginTop: 20 }]}>Categoría</Text>
      <View style={styles.categoriesContainer}>
        {Object.keys(incomeCategories).map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={({ pressed }) => ({
              width: 50,
              height: 50,
              borderRadius: 8,
              backgroundColor:
                selectedCategory === category ? "#4CAF50" : "#ccc",
              opacity: pressed ? 0.6 : 1,
              marginRight: 10,
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            {incomeCategories[category](
              selectedCategory === category ? "white" : "black"
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.buttons}>
        <Button title="Guardar cambios" onPress={handleSave} />
        <Button title="Eliminar" color="red" onPress={handleDelete} />
        <Button title="Cerrar" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "500", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 6,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    gap: 10,
  },
  buttons: { marginTop: 24, flexDirection: "column", gap: 12 },
});
