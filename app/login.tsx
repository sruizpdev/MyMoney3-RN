import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
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

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

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
      <Pressable onPress={handlePress}>
        <Animated.View style={[styles.key, { transform: [{ scale }] }]}>
          <Text style={styles.keyText}>{value}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
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
        {numbers.slice(0, 9).map((n) => (
          <AnimatedKey key={n} value={n} onPress={() => handleKeyPress(n)} />
        ))}

        <View style={styles.keyEmpty} />
        <AnimatedKey value="0" onPress={() => handleKeyPress("0")} />
        <AnimatedKey value="⌫" onPress={handleDelete} />
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
  title: { fontSize: 22, marginBottom: 40 },
  pinDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    gap: 15,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  dotFilled: { backgroundColor: "#333" },
  numpad: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 220,
    justifyContent: "center",
    gap: 15,
  },
  key: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#eee",
  },
  keyEmpty: { width: 60, height: 60, margin: 0 },
  keyText: { fontSize: 22 },
});
