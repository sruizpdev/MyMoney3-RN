// AddExpense.tsx
import { expenseCategories } from "@/services/category-icons";
import { expenseCategoryNames } from "@/services/category-names";
import { addTransaction } from "@/services/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button as PaperButton, TextInput, useTheme } from "react-native-paper";

export default function AddExpense() {
  const theme = useTheme(); // Para usar color por defecto de Paper
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("food");

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
        setSelectedCategory("food");
        router.push("/(tabs)/home");
      } else {
        Alert.alert("Error", "No se pudo guardar el gasto");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar el gasto");
    }
  };

  const openPicker = () => setShowPicker(true);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Inputs */}
      <TextInput
        mode="outlined"
        label="Descripción"
        placeholder="Ej: Mercadona"
        value={description}
        onChangeText={setDescription}
        style={{ marginBottom: 16 }}
      />

      <TextInput
        mode="outlined"
        label="Cantidad (€)"
        placeholder="Ej: 45.90"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ marginBottom: 16 }}
      />

      {/* Fecha */}
      <TextInput
        mode="outlined"
        label="Fecha"
        value={date.toLocaleDateString("es-ES")}
        editable={false}
        onPressIn={openPicker}
        right={<TextInput.Icon icon="calendar" onPress={openPicker} />}
        style={{ marginBottom: 16 }}
      />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Categorías */}
      <Text style={[styles.label, { marginBottom: 8 }]}>Categoría</Text>
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
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent", // plano
              }}
            >
              {expenseCategories[category](
                selectedCategory === category
                  ? theme.colors.primary // color por defecto de Paper para seleccionado
                  : theme.colors.onSurface,
                32
              )}
            </View>
            <Text style={styles.categoryLabel}>
              {expenseCategoryNames[category]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Guardar */}
      <PaperButton
        mode="contained"
        onPress={handleSave}
        style={{ marginTop: 24 }}
      >
        Guardar gasto
      </PaperButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, fontWeight: "500", marginTop: 12 },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  categoryLabel: {
    marginTop: 0,
    fontSize: 12,
    textAlign: "center",
  },
});
