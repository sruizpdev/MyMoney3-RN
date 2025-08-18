import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../context/auth-context";

export default function Login() {
  const [pin, setPin] = useState("");
  const { signIn } = useAuth();
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleKeyPress = async (num: string) => {
    if (pin.length < 4) {
      const next = pin + num;
      setPin(next);

      if (next.length === 4) {
        const success = await signIn(next);
        if (success) {
          router.replace("/(tabs)/home"); // ruta protegida
        } else {
          triggerShake();
          setTimeout(() => setPin(""), 300);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderDot = (index: number) => (
    <View
      key={index}
      style={[styles.dot, index < pin.length ? styles.dotFilled : null]}
    />
  );

  const AnimatedKey = ({
    value,
    onPress,
  }: {
    value: string;
    onPress: () => void;
  }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const animatePress = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const handlePress = () => {
      animatePress();
      onPress();
    };

    return (
      <Pressable
        onPress={handlePress}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Animated.View style={[styles.key, { transform: [{ scale }] }]}>
          <Text style={styles.keyText}>{value}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  const rows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "⌫"],
  ];

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo-512.webp")}
        style={styles.logo}
      />
      <Text style={styles.title}>Bienvenido a MyMoney3</Text>

      <Animated.View
        style={[
          styles.pinDotsContainer,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        {[0, 1, 2, 3].map(renderDot)}
      </Animated.View>

      <View style={styles.numpad}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((n, i) => {
              if (n === "⌫") {
                return pin.length > 0 ? (
                  <AnimatedKey key={i} value="⌫" onPress={handleDelete} />
                ) : (
                  <View key={i} style={styles.keyEmpty} /> // espacio igual al resto
                );
              }
              if (n === "") return <View key={i} style={styles.keyEmpty} />;

              return (
                <AnimatedKey
                  key={i}
                  value={n}
                  onPress={() => handleKeyPress(n)}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: { width: 100, height: 100, marginBottom: 30 },
  title: { fontSize: 16, marginBottom: 30 },
  pinDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    gap: 15,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  dotFilled: { backgroundColor: "#333" },
  numpad: { marginTop: 40 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 280,
    marginBottom: 10,
  },
  key: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  keyEmpty: { width: 60, height: 60 },
  keyText: { fontSize: 30 },
});
