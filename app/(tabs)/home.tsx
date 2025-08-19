import ExpenseModal from "@/components/ExpenseModal";
import IncomeModal from "@/components/IncomeModal";
import { getTransactions } from "@/services/supabase";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Transaction } from "../../interfaces";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    const data = await getTransactions();
    setTransactions(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity onPress={() => setSelectedTransaction(item)}>
      <View style={styles.transactionItem}>
        <View style={styles.left}>
          <Text style={styles.description}>
            {item.description}{" "}
            <Text style={styles.type}>
              ({item.type === "income" ? "Ingreso" : "Gasto"})
            </Text>
          </Text>
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
    </TouchableOpacity>
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

      {selectedTransaction && selectedTransaction.type === "expense" && (
        <ExpenseModal
          transaction={selectedTransaction}
          visible={true}
          onClose={() => setSelectedTransaction(null)}
          onUpdated={fetchTransactions}
        />
      )}

      {selectedTransaction && selectedTransaction.type === "income" && (
        <IncomeModal
          transaction={selectedTransaction}
          visible={true}
          onClose={() => setSelectedTransaction(null)}
          onUpdated={fetchTransactions}
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
  type: { fontSize: 12, color: "#666" },
  date: { fontSize: 12, color: "#666", marginTop: 2 },
  amount: { fontSize: 16, fontWeight: "bold" },
  separator: { height: 1, backgroundColor: "#e0e0e0" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
