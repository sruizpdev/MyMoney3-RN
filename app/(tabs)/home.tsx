import { colors, globalStyles } from "@/utils/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Transaction } from "../../interfaces";
import {
  expenseCategories,
  incomeCategories,
} from "../../services/category-icons";
import {
  getMonthlyBalance,
  getMonthlyExpense,
  getMonthlyIncome,
  getMonthlyTransactions,
} from "../../services/supabase";

import { setPushToken } from "@/services/pushToken";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { registerPushToken } from "../../services/pushService";

export default function Home() {
  const [balanceData, setBalanceData] = useState<{
    balance: number;
    mes: string;
  } | null>(null);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true); // <-- loader

  // Registrar token push al iniciar
  useEffect(() => {
    const registerPushTokenAsync = async () => {
      if (!Device.isDevice) {
        return;
      }
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        return;
      }
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const newToken: string = tokenData.data;
      console.log("Expo Push Token obtenido:", newToken);
      await setPushToken(newToken);
      await registerPushToken(newToken);
    };
    registerPushTokenAsync();
  }, []);

  // Traer datos al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true); // <-- iniciar loader
        const bal = await getMonthlyBalance();
        const inc = await getMonthlyIncome();
        const exp = await getMonthlyExpense();
        const trans = await getMonthlyTransactions();

        setBalanceData(bal);
        setIncome(inc);
        setExpense(exp);
        setTransactions(trans);
        setIsLoading(false); // <-- terminar loader
      };

      fetchData();
    }, [])
  );

  const handlePress = (item: Transaction) => {
    if (item.type === "income") {
      router.push(`/screens/income-details?id=${item.id}`);
    } else {
      router.push(`/screens/expense-details?id=${item.id}`);
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const IconFn =
      item.type === "income"
        ? incomeCategories[item.category]
        : expenseCategories[item.category];

    return (
      <Pressable
        onPress={() => handlePress(item)}
        style={({ pressed }) => [
          styles.transactionItem,
          pressed && { opacity: 0.5 },
        ]}
      >
        <View style={{ width: 40, justifyContent: "center" }}>
          {IconFn ? IconFn(colors.p1, 22) : null}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString("es-ES")}
          </Text>
        </View>

        <View style={{ width: 100, alignItems: "flex-end" }}>
          <Text
            style={[
              styles.amount,
              { color: item.type === "income" ? "green" : "red" },
            ]}
          >
            {item.type === "income" ? "+" : "-"}
            {item.amount} €
          </Text>
        </View>
      </Pressable>
    );
  };

  // Mostrar loader mientras se cargan los datos
  if (isLoading) {
    return (
      <View
        style={[
          styles.mainContainer,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.p1} />
        <Text style={{ marginTop: 15, fontSize: 16, color: colors.p1 }}>
          Cargando datos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {balanceData && (
        <View style={styles.balanceContainer}>
          <Text style={globalStyles.title}>{balanceData.mes}</Text>
          <Text
            style={[
              styles.balance,
              { color: balanceData.balance >= 0 ? colors.p1 : colors.p6 },
            ]}
          >
            {balanceData.balance.toFixed(2)} €
          </Text>
          <View style={styles.totalsRow}>
            <View style={styles.totalBox}>
              <MaterialIcons
                name="arrow-downward"
                size={16}
                color={colors.p7}
              />
              <Text style={styles.totalText}>{income.toFixed(2)} €</Text>
            </View>
            <View style={styles.totalBox}>
              <MaterialIcons name="arrow-upward" size={16} color={colors.p6} />
              <Text style={styles.totalText}>{expense.toFixed(2)} €</Text>
            </View>
          </View>
        </View>
      )}
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 10 }}
        ListHeaderComponent={
          <Text
            style={[
              globalStyles.title,
              {
                textAlign: "center",
                marginBottom: 20,
                textTransform: "uppercase",
              },
            ]}
          >
            Transacciones:
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.bg },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 20,
    height: 170,
    paddingTop: 60,
    paddingHorizontal: 30,
    backgroundColor: colors.p5,
  },
  balance: { fontSize: 34, fontWeight: "bold" },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  totalBox: { flexDirection: "row", alignItems: "center" },
  totalText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
    color: colors.p1,
  },
  transactionItem: { flexDirection: "row", paddingVertical: 8 },
  description: { fontSize: 16, fontWeight: "400", color: colors.p1 },
  date: { fontSize: 12, color: colors.p2, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: "400" },
  separator: { height: 1, backgroundColor: colors.p4 },
});
