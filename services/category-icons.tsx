// category-icons.tsx
import {
  Entypo,
  FontAwesome6,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { JSX } from "react";

export type IconInfoFn = (color: string, size?: number) => JSX.Element;

export const expenseCategories: Record<string, IconInfoFn> = {
  food: (color, size = 32) => (
    <Entypo name="shopping-basket" size={size} color={color} />
  ),
  cats: (color, size = 32) => (
    <FontAwesome6 name="cat" size={size} color={color} />
  ),
  house: (color, size = 32) => (
    <Ionicons name="home" size={size} color={color} />
  ),
  utilities: (color, size = 32) => (
    <FontAwesome6 name="plug-circle-bolt" size={size} color={color} />
  ),
  health: (color, size = 32) => (
    <Ionicons name="fitness" size={size} color={color} />
  ),
  shopping: (color, size = 32) => (
    <Fontisto name="shopping-bag-1" size={size} color={color} />
  ),
  leisure: (color, size = 32) => (
    <MaterialIcons name="ramen-dining" size={size} color={color} />
  ),
  car: (color, size = 32) => (
    <MaterialCommunityIcons name="car" size={size} color={color} />
  ),
  motorbike: (color, size = 32) => (
    <MaterialCommunityIcons name="racing-helmet" size={size} color={color} />
  ),
  public_transport: (color, size = 32) => (
    <MaterialCommunityIcons name="bus" size={size} color={color} />
  ),
  treats: (color, size = 32) => (
    <MaterialCommunityIcons name="gift" size={size} color={color} />
  ),
  other: (color, size = 32) => (
    <MaterialCommunityIcons name="cash-fast" size={size} color={color} />
  ),
};

export const incomeCategories: Record<string, IconInfoFn> = {
  salary: (color, size = 32) => (
    <MaterialCommunityIcons name="hand-coin" size={size} color={color} />
  ),
  investment: (color, size = 32) => (
    <Entypo name="bar-graph" size={size} color={color} />
  ),
  other_income: (color, size = 32) => (
    <MaterialCommunityIcons name="cash-plus" size={size} color={color} />
  ),
};
