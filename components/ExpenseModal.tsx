import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Transaction } from "../interfaces";
import { deleteTransaction, updateTransaction } from "../services/supabase";

type Props = {
  transaction: Transaction;
  visible: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export default function ExpenseModal({
  transaction,
  visible,
  onClose,
  onUpdated,
}: Props) {
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [date, setDate] = useState(new Date(transaction.date));
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = async () => {
    if (!description || !amount) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const updated = {
      description,
      amount: parseFloat(amount),
      date: date.toISOString().split("T")[0],
    };

    try {
      const result = await updateTransaction(String(transaction.id), updated);
      if (result) {
        onUpdated();
        onClose();
      } else {
        Alert.alert("Error", "No se pudo actualizar la transacción");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar la transacción");
    }
  };

  const handleDelete = async () => {
    const confirmed = await new Promise<boolean>((resolve) =>
      Alert.alert("Confirmar", "¿Eliminar esta transacción?", [
        { text: "Cancelar", onPress: () => resolve(false) },
        {
          text: "Eliminar",
          onPress: () => resolve(true),
          style: "destructive",
        },
      ])
    );

    if (!confirmed) return;

    try {
      const success = await deleteTransaction(String(transaction.id));
      if (success) {
        onUpdated();
        onClose();
      } else {
        Alert.alert("Error", "No se pudo eliminar la transacción");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo eliminar la transacción");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
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

        <View style={styles.buttons}>
          <Button title="Guardar cambios" onPress={handleSave} />
          <Button title="Eliminar" color="red" onPress={handleDelete} />
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </View>
    </Modal>
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
  buttons: { marginTop: 24, flexDirection: "column", gap: 12 },
});
