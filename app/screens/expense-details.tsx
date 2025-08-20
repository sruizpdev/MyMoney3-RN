import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
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
import {
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../../services/supabase";

export default function ExpenseDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchTransaction = async () => {
      const all = await getTransactions();
      const found = all.find((t) => String(t.id) === id);
      if (found) {
        setTransaction(found);
        setDescription(found.description);
        setAmount(String(found.amount));
        setSelectedCategory(found.category);
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
      date: transaction.date,
      category: selectedCategory,
    };

    try {
      const result = await updateTransaction(String(transaction.id), updated);
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
        }\nCantidad: ${transaction.amount} €\nFecha: ${new Date(
          transaction.date
        ).toLocaleDateString("es-ES")}`,
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <Text>{new Date(transaction.date).toLocaleDateString("es-ES")}</Text>

      <Text style={styles.label}>Tipo</Text>
      <Text>{transaction.type}</Text>

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

      <View style={styles.buttons}>
        <Button title="Guardar cambios" onPress={handleSave} />
        <Button title="Eliminar" color="red" onPress={handleDelete} />
        <Button title="Cerrar" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "500", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 6,
  },
  buttons: { marginTop: 24, flexDirection: "column", gap: 12 },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  categoryLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
});
