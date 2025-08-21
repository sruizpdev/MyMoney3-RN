// AddExpense.tsx
import { expenseCategories } from "@/services/category-icons";
import { expenseCategoryNames } from "@/services/category-names";
import { addTransaction } from "@/services/supabase";
import { colors, globalStyles } from "@/utils/globalStyles";
import { Feather, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
  const [selectedCategory, setSelectedCategory] = useState<string>("food");

  // 👇 Solo lógica para cambiar color del borde (sin tocar estilos existentes)
  const [amountFocused, setAmountFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
  const [dateFocused, setDateFocused] = useState(false);

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
      contentContainerStyle={globalStyles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flexDirection: "row", marginBottom: 14 }}>
        <Pressable
          onPress={openPicker}
          onPressIn={() => setDateFocused(true)}
          onPressOut={() => setDateFocused(false)}
          style={[
            globalStyles.input,
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              marginRight: 12,
              borderColor: showPicker || dateFocused ? colors.p3 : colors.p4,
            },
          ]}
        >
          <Ionicons
            name="calendar-number-outline"
            size={20}
            color={colors.p1}
          />
          <Text
            style={[
              globalStyles.textBold,
              { color: colors.p3, marginLeft: 8, fontSize: 16 },
            ]}
          >
            {date.toLocaleDateString("es-ES")}
          </Text>
        </Pressable>

        <View
          style={[
            globalStyles.input,
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,

              borderColor: amountFocused ? colors.p3 : colors.p4,
            },
          ]}
        >
          <Ionicons name="logo-euro" size={20} color={colors.p1} />
          <TextInput
            placeholder="Ej. 45.90"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            onFocus={() => setAmountFocused(true)}
            onBlur={() => setAmountFocused(false)}
            style={[
              globalStyles.text,
              {
                flex: 1,
                color: amount ? colors.p3 : colors.p1,
                fontWeight: amount ? "600" : "400",
              },
            ]}
            placeholderTextColor={colors.p4}
          />
        </View>
      </View>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            setDateFocused(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}
      >
        <View
          style={[
            globalStyles.input,
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              borderColor: descFocused ? colors.p3 : colors.p4,
            },
          ]}
        >
          <Feather name="edit" size={20} color={colors.p1} />
          <TextInput
            placeholder="Ej. Mercadona"
            value={description}
            onChangeText={setDescription}
            onFocus={() => setDescFocused(true)}
            onBlur={() => setDescFocused(false)}
            style={[
              globalStyles.text,
              {
                flex: 1,
                color: description ? colors.p3 : colors.p1,
                fontWeight: description ? "600" : "400",
              },
            ]}
            placeholderTextColor={colors.p4}
          />
        </View>
      </View>

      <Text style={[globalStyles.label, { textAlign: "center" }]}>
        Categoría del gasto:
      </Text>
      <View style={styles.categoriesGrid}>
        {Object.keys(expenseCategories).map((category) => {
          const isSelected = selectedCategory === category;
          const color = isSelected ? colors.p3 : colors.p1;

          return (
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
                  width: 40,
                  height: 38,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {expenseCategories[category](color, 32)}
              </View>
              <Text
                style={[
                  styles.categoryLabel,
                  { color, fontWeight: isSelected ? "600" : "400" },
                ]}
              >
                {expenseCategoryNames[category]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={globalStyles.button} onPress={handleSave}>
        <Text style={{ color: colors.bg, fontWeight: "600", fontSize: 18 }}>
          Guardar gasto
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  categoryLabel: {
    fontSize: 14,
    textAlign: "center",
  },
});
