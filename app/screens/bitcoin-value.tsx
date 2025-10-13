// app/screens/bitcoin-value.tsx
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function BitcoinValueScreen() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const myBitcoin = 0.15683096;

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur"
        );
        const data = await res.json();
        if (data.bitcoin && data.bitcoin.eur) {
          setBtcPrice(data.bitcoin.eur);
        } else {
          setError("No se pudo obtener el precio de Bitcoin.");
        }
      } catch (err) {
        console.error(err);
        setError("Error al obtener el precio de Bitcoin.");
      } finally {
        setLoading(false);
      }
    };

    fetchBitcoinPrice();
  }, []);

  const totalValue = btcPrice ? (btcPrice * myBitcoin).toFixed(2) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Valor de tus Bitcoins</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#f7931a" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.dashboard}>
          <View style={styles.card}>
            <Text style={styles.label}>Precio actual BTC</Text>
            <Text style={styles.value}>{btcPrice?.toFixed(2)} €</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Tus BTC</Text>
            <Text style={styles.value}>{myBitcoin}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Valor total</Text>
            <Text style={styles.total}>{totalValue} €</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  dashboard: {
    width: "100%",
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f7931a",
  },
  total: {
    fontSize: 22,
    fontWeight: "800",
    color: "#f7931a",
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
