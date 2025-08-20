// category-icons.tsx
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { JSX } from "react";

export type IconInfoFn = (color: string, size?: number) => JSX.Element;

export const expenseCategories: Record<string, IconInfoFn> = {
  food: (color, size = 32) => (
    <MaterialCommunityIcons
      name="silverware-fork-knife"
      size={size}
      color={color}
    />
  ),
  cats: (color, size = 32) => (
    <MaterialCommunityIcons name="cat" size={size} color={color} />
  ),
  house: (color, size = 32) => (
    <MaterialCommunityIcons name="home" size={size} color={color} />
  ),
  utilities: (color, size = 32) => (
    <MaterialCommunityIcons name="flash" size={size} color={color} />
  ),
  health: (color, size = 32) => (
    <Ionicons name="fitness" size={size} color={color} />
  ),
  shopping: (color, size = 32) => (
    <FontAwesome5 name="shopping-bag" size={size} color={color} />
  ),
  leisure: (color, size = 32) => (
    <MaterialCommunityIcons name="movie" size={size} color={color} />
  ),
  car: (color, size = 32) => (
    <MaterialCommunityIcons name="car" size={size} color={color} />
  ),
  motorbike: (color, size = 32) => (
    <MaterialCommunityIcons name="motorbike" size={size} color={color} />
  ),
  public_transport: (color, size = 32) => (
    <MaterialCommunityIcons name="bus" size={size} color={color} />
  ),
  treats: (color, size = 32) => (
    <MaterialCommunityIcons name="gift" size={size} color={color} />
  ),
  other: (color, size = 32) => (
    <MaterialCommunityIcons name="dots-horizontal" size={size} color={color} />
  ),
};

export const incomeCategories: Record<string, IconInfoFn> = {
  salary: (color, size = 32) => (
    <MaterialCommunityIcons name="cash" size={size} color={color} />
  ),
  investment: (color, size = 32) => (
    <MaterialCommunityIcons name="trending-up" size={size} color={color} />
  ),
  other_income: (color, size = 32) => (
    <MaterialCommunityIcons name="currency-usd" size={size} color={color} />
  ),
};
