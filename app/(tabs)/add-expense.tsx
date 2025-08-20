// AddExpense.tsx
import { expenseCategories } from "@/services/category-icons"; // <-- solo gastos
import { expenseCategoryNames } from "@/services/category-names";
import { addTransaction } from "@/services/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddExpense() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("other");

  const router = useRouter();

  const handleSave = async () => {
    if (!description || !amount) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    const newExpense = {
      description,
      amount: parseFloat(amount),
      date: date.toISOString().split("T")[0],
      type: "expense" as const,
      category: selectedCategory,
    };

    try {
      const saved = await addTransaction(newExpense);

      if (saved && saved.id) {
        setDescription("");
        setAmount("");
        setDate(new Date());
        setSelectedCategory("other");
        router.push("/(tabs)/home");
      } else {
        Alert.alert("Error", "No se pudo guardar el gasto");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar el gasto");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Supermercado"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Cantidad (€)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 45.90"
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
      <View style={styles.categoriesGrid}>
        {Object.keys(expenseCategories).map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={({ pressed }) => ({
              width: 70,
              margin: 6,
              alignItems: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                borderWidth: selectedCategory === category ? 2 : 0,
                borderColor: "#4CAF50",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {expenseCategories[category](
                selectedCategory === category ? "#4CAF50" : "#555",
                32
              )}
            </View>
            <Text style={styles.categoryLabel}>
              {expenseCategoryNames[category]}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.saveButton}>
        <Button title="Guardar gasto" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
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
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  categoryLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
});
