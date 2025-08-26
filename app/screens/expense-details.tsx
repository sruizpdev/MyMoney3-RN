import { Feather, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Transaction } from "../../interfaces";
import { expenseCategories } from "../../services/category-icons";
import { expenseCategoryNames } from "../../services/category-names";
import { getPushToken } from "../../services/pushToken";
import {
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../../services/supabase";
import { colors, globalStyles } from "../../utils/globalStyles";

export default function ExpenseDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Bordes dinámicos
  const [descFocused, setDescFocused] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);
  const [dateFocused, setDateFocused] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      const all = await getTransactions();
      const found = all.find((t) => String(t.id) === id);
      if (found) {
        setTransaction(found);
        setDescription(found.description);
        setAmount(String(found.amount));
        setSelectedCategory(found.category);
        setDate(new Date(found.date));
      }
    };
    fetchTransaction();
  }, [id]);

  if (!transaction) return <Text>Cargando...</Text>;

  const handleSave = async () => {
    if (!description || !amount) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    const updated = {
      description,
      amount: parseFloat(amount),
      date: date.toISOString().split("T")[0],
      category: selectedCategory,
    };

    try {
      const token = await getPushToken();
      if (!token) {
        Alert.alert("Error", "No se pudo obtener el token de notificación");
        return;
      }

      const result = await updateTransaction(
        String(transaction.id),
        updated,
        token
      );
      if (result) {
        Alert.alert("Actualizado");
        router.back();
      } else {
        Alert.alert("Error al actualizar");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error al actualizar");
    }
  };

  const handleDelete = async () => {
    const confirmed = await new Promise<boolean>((resolve) =>
      Alert.alert(
        "Confirmar eliminación",
        `¿Eliminar esta transacción?\n\nDescripción: ${
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
      const token = await getPushToken();
      if (!token) {
        Alert.alert("Error", "No se pudo obtener el token de notificación");
        return;
      }

      const success = await deleteTransaction(String(transaction.id), token);
      if (success) {
        Alert.alert("Transacción eliminada");
        router.back();
      } else {
        Alert.alert("Error al eliminar la transacción");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error al eliminar la transacción");
    }
  };

  const openPicker = () => setShowPicker(true);

  return (
    <ScrollView
      contentContainerStyle={{
        ...globalStyles.container,
        flexGrow: 1,
        paddingTop: 100,
        paddingBottom: 20,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={globalStyles.screenTitle}>Datos del Gasto</Text>

      {/* Fecha y Cantidad */}
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
            style={[{ color: colors.textPrimary, marginLeft: 8, fontSize: 16 }]}
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
                marginLeft: 8,
              },
            ]}
            placeholderTextColor={colors.iconPressed}
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

      {/* Descripción */}
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
                marginLeft: 8,
              },
            ]}
            placeholderTextColor={colors.iconPressed}
          />
        </View>
      </View>

      {/* Categorías */}
      <Text
        style={[globalStyles.label, { textAlign: "center", marginBottom: 15 }]}
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
        style={[globalStyles.button, { marginTop: 30 }]}
        onPress={handleSave}
      >
        <Text
          style={{
            color: colors.background,
            fontWeight: "600",
            fontSize: 18,
          }}
        >
          Guardar cambios
        </Text>
      </Pressable>
      <Pressable style={{ marginVertical: 20 }} onPress={handleDelete}>
        <Text
          style={{
            color: "red",
            fontWeight: "400",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Eliminar
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
