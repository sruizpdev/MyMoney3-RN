import { colors, globalStyles } from "@/utils/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
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

import { getPushToken, setPushToken } from "@/services/pushToken";
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

  // Registrar token push al iniciar
  useEffect(() => {
    const registerPushTokenAsync = async () => {
      // Solo en dispositivos físicos
      if (!Device.isDevice) {
        console.log("Las notificaciones push requieren un dispositivo físico");
        return;
      }

      // Revisar permisos existentes
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Pedir permisos si no están concedidos
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Permisos de notificación no concedidos");
        return;
      }

      // Revisar si ya tenemos token local
      let token = getPushToken(); // string | null

      if (!token) {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        console.log("Expo Push Token:", tokenData.data);

        const newToken: string = tokenData.data; // explicitamos string
        setPushToken(newToken); // no await, es sincrónica
        console.log("Expo Push Token:", newToken);

        // Registrar token en Supabase
        await registerPushToken(newToken);
      } else {
        console.log("Token ya registrado localmente:", token);
      }
    };

    registerPushTokenAsync();
  }, []);

  // Traer datos al enfocar la pantalla
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

  // Navegación a detalle
  const handlePress = (item: Transaction) => {
    if (item.type === "income") {
      router.push(`/screens/income-details?id=${item.id}`);
    } else {
      router.push(`/screens/expense-details?id=${item.id}`);
    }
  };

  // Render de cada transacción
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
