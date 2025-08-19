import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Transaction } from "../../interfaces";
import { getTransactions } from "../../services/supabase";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = async () => {
    setLoading(true);
    const data = await getTransactions();
    setTransactions(data);
    setLoading(false);
  };

  // Se ejecuta cada vez que la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.left}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString("es-ES")}
        </Text>
      </View>
      <Text
        style={[
          styles.amount,
          { color: item.type === "income" ? "green" : "red" },
        ]}
      >
        {item.amount} €
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loading}>
          <Text>Cargando transacciones...</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  left: { flex: 1 },
  description: { fontSize: 16, fontWeight: "500" },
  date: { fontSize: 12, color: "#666", marginTop: 2 },
  amount: { fontSize: 16, fontWeight: "bold" },
  separator: { height: 1, backgroundColor: "#e0e0e0" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
