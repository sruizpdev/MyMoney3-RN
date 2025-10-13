import { expenseCategories } from "@/services/category-icons";
import { expenseCategoryNames } from "@/services/category-names";
import { getTransactions } from "@/services/supabase";
import { colors } from "@/utils/globalStyles";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ExpenseByCategory {
  category: string;
  total: number;
  dailyAverage: number;
}

export default function ExpensesByCategoryScreen() {
  const [totals, setTotals] = useState<ExpenseByCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const dayOfMonth = now.getDate();

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const transactions = await getTransactions();
        const monthTransactions = transactions.filter(
          (t: any) => t.type === "expense" && t.date.startsWith(currentMonth)
        );

        const totalsMap: Record<string, number> = {};
        monthTransactions.forEach((t: any) => {
          if (!totalsMap[t.category]) totalsMap[t.category] = 0;
          totalsMap[t.category] += parseFloat(t.amount);
        });

        const totalsArray: ExpenseByCategory[] = Object.entries(totalsMap).map(
          ([category, total]) => ({
            category,
            total,
            dailyAverage: total / dayOfMonth,
          })
        );

        setTotals(totalsArray);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Gastos por Categoría</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.textPrimary} />
        ) : totals.length === 0 ? (
          <Text style={styles.noData}>No hay gastos este mes.</Text>
        ) : (
          totals.map((item) => {
            const IconFn = expenseCategories[item.category];
            return (
              <View key={item.category} style={styles.card}>
                <View style={styles.leftRow}>
                  {IconFn && IconFn(colors.textPrimary, 20)}
                  <Text style={styles.label}>
                    {expenseCategoryNames[item.category] || item.category}
                  </Text>
                </View>
                <View style={styles.valuesRow}>
                  <Text style={styles.total}>{item.total.toFixed(2)} €</Text>
                  <Text style={styles.daily}>
                    {item.dailyAverage.toFixed(2)} €/día
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.background },
  container: { padding: 10, alignItems: "center" },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftRow: { flexDirection: "row", alignItems: "center" },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    marginLeft: 6,
  },
  valuesRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  total: { fontSize: 14, fontWeight: "700", color: "#f7931a", marginRight: 8 },
  daily: { fontSize: 12, color: colors.textSecondary },
  noData: { fontSize: 14, textAlign: "center", marginTop: 20 },
});
