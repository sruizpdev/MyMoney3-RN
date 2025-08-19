import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Transaction } from "../../interfaces";
import {
  getMonthlyBalance,
  getMonthlyExpense,
  getMonthlyIncome,
  getMonthlyTransactions,
} from "../../services/supabase";

export default function Home() {
  const [balanceData, setBalanceData] = useState<{
    balance: number;
    mes: string;
  } | null>(null);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const bal = await getMonthlyBalance();
        const inc = await getMonthlyIncome();
        const exp = await getMonthlyExpense();
        const trans = await getMonthlyTransactions();

        setBalanceData(bal);
        setIncome(inc);
        setExpense(exp);
        setTransactions(trans);
      };

      fetchData();
    }, [])
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View>
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
      {/* SECCIÓN BALANCE */}
      {balanceData && (
        <View style={styles.balanceContainer}>
          <Text style={styles.month}>{balanceData.mes}</Text>
          <Text
            style={[
              styles.balance,
              { color: balanceData.balance >= 0 ? "green" : "red" },
            ]}
          >
            {balanceData.balance.toFixed(2)} €
          </Text>
          <View style={styles.totalsRow}>
            <View style={styles.totalBox}>
              <MaterialIcons name="arrow-downward" size={16} color="green" />
              <Text style={styles.totalText}>{income.toFixed(2)} €</Text>
            </View>
            <View style={styles.totalBox}>
              <MaterialIcons name="arrow-upward" size={16} color="red" />
              <Text style={styles.totalText}>{expense.toFixed(2)} €</Text>
            </View>
          </View>
        </View>
      )}

      {/* LISTA DE TRANSACCIONES */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  balanceContainer: { alignItems: "center", marginBottom: 16 },
  month: { fontSize: 14, color: "#666", marginBottom: 4 },
  balance: { fontSize: 32, fontWeight: "bold" },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  totalBox: { flexDirection: "row", alignItems: "center" },
  totalText: { fontSize: 14, fontWeight: "500", marginLeft: 4 },

  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  description: { fontSize: 16, fontWeight: "500" },
  date: { fontSize: 12, color: "#666", marginTop: 2 },
  amount: { fontSize: 16, fontWeight: "bold" },
  separator: { height: 1, backgroundColor: "#e0e0e0" },
});
