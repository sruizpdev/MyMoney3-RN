import { expenseCategories } from "@/services/category-icons";
import { expenseCategoryNames } from "@/services/category-names";
import { addTransaction } from "@/services/supabase";

import { getPushToken } from "@/services/pushToken";
import { colors, globalStyles } from "@/utils/globalStyles";
import { Feather, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

  const [amountFocused, setAmountFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
  const [dateFocused, setDateFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const handleSave = async () => {
    if (!description || !amount) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (isSaving) return;
    setIsSaving(true);

    const newExpense = {
      description,
      amount: parseFloat(amount),
      date: date.toISOString().split("T")[0],
      type: "expense" as const,
      category: selectedCategory,
    };

    try {
      const token = await getPushToken();
      if (!token) {
        Alert.alert("Error", "No se pudo obtener el token de notificación");
        return;
      }

      const saved = await addTransaction(newExpense, token);

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
    } finally {
      setIsSaving(false);
    }
  };

  const openPicker = () => setShowPicker(true);

  return (
    <ScrollView
      contentContainerStyle={globalStyles.container}
      keyboardShouldPersistTaps="always"
      style={{ marginTop: 80 }}
    >
      <Text style={globalStyles.screenTitle}>Nuevo gasto</Text>
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
              borderColor:
                showPicker || dateFocused
                  ? colors.iconSelected
                  : colors.iconPressed,
            },
          ]}
        >
          <Ionicons
            name="calendar-number-outline"
            size={20}
            color={colors.textPrimary}
          />
          <Text
            style={[
              {
                color: colors.textPrimary,
                marginLeft: 8,
                fontSize: 16,
              },
            ]}
          >
            {date.toLocaleDateString("es-ES")}
          </Text>
        </Pressable>
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
          style={[
            globalStyles.input,
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              borderColor: amountFocused
                ? colors.iconSelected
                : colors.iconPressed,
            },
          ]}
        >
          <Ionicons name="logo-euro" size={20} color={colors.textPrimary} />
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
                color: amount ? colors.textPrimary : colors.iconPressed,
                fontWeight: amount ? "600" : "400",
              },
            ]}
            placeholderTextColor={colors.iconPressed}
          />
        </View>
      </View>

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
              borderColor: descFocused
                ? colors.iconSelected
                : colors.iconPressed,
            },
          ]}
        >
          <Feather name="edit" size={20} color={colors.textPrimary} />
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
                color: description ? colors.textPrimary : colors.iconPressed,
                fontWeight: description ? "600" : "400",
              },
            ]}
            placeholderTextColor={colors.iconPressed}
          />
        </View>
      </View>

      <Text
        style={[globalStyles.title, { textAlign: "center", marginBottom: 15 }]}
      >
        Categoría del gasto:
      </Text>
      <View style={styles.categoriesGrid}>
        {Object.keys(expenseCategories).map((category) => {
          const isSelected = selectedCategory === category;
          const color = isSelected ? colors.iconSelected : colors.textPrimary;

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

      <Pressable
        style={[
          globalStyles.button,
          {
            marginTop: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: isSaving ? 0.7 : 1,
          },
        ]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <ActivityIndicator size="small" color={colors.background} />
            <Text
              style={{
                color: colors.background,
                fontWeight: "600",
                fontSize: 18,
                marginLeft: 8,
              }}
            >
              Guardando...
            </Text>
          </>
        ) : (
          <Text
            style={{
              color: colors.background,
              fontWeight: "600",
              fontSize: 18,
            }}
          >
            Guardar gasto
          </Text>
        )}
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
