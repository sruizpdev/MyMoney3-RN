import React, { useEffect, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import { Transaction } from "../../interfaces";
import { getTransactions } from "../../services/supabase";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const data: Transaction[] = await getTransactions();
      setTransactions(data);
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  const renderItem: ListRenderItem<Transaction> = ({ item }) => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return (
      <View style={styles.transactionItem}>
        <View style={styles.left}>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
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
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Cargando transacciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  left: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
