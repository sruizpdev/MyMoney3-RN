import { Transaction } from "../interfaces";
import { supabase } from "../utils/supabase";

// --------------------
// Funciones generales
// --------------------

// Obtener todas las transacciones
export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error.message);
    return [];
  }

  return data || [];
};

// Crear una nueva transacción
export const addTransaction = async (transaction: Omit<Transaction, "id">) => {
  const { data, error } = await supabase
    .from("transactions")
    .insert([transaction])
    .select("*"); // Devuelve la fila insertada

  if (error) {
    console.error("Error adding transaction:", error.message);
    return null;
  }

  return data?.[0] || null;
};

// Actualizar transacción
export const updateTransaction = async (
  id: string,
  updated: Partial<Transaction>
) => {
  const { data, error } = await supabase
    .from("transactions")
    .update(updated)
    .eq("id", id)
    .select("*");

  if (error) {
    console.error("Error updating transaction:", error.message);
    return null;
  }

  return data?.[0] || null;
};

// Borrar transacción por id
export const deleteTransaction = async (id: string) => {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    console.error("Error deleting transaction:", error.message);
    return false;
  }

  return true;
};

// --------------------
// Funciones RPC (mes actual)
// --------------------

export const getMonthlyBalance = async (): Promise<{
  balance: number;
  mes: string;
} | null> => {
  const { data, error } = await supabase.rpc("monthly_balance");

  if (error) {
    console.error("Error fetching monthly balance:", error.message);
    return null;
  }

  return data?.[0] || null;
};

export const getMonthlyIncome = async (): Promise<number> => {
  const { data, error } = await supabase.rpc("monthly_incomes");

  if (error) {
    console.error("Error fetching monthly income:", error.message);
    return 0;
  }

  return data?.[0]?.total || 0;
};

export const getMonthlyExpense = async (): Promise<number> => {
  const { data, error } = await supabase.rpc("monthly_expenses");

  if (error) {
    console.error("Error fetching monthly expense:", error.message);
    return 0;
  }

  return data?.[0]?.total || 0;
};

export const getMonthlyTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .rpc("monthly_transactions") // tu RPC ya devuelve las transacciones del mes
    .order("date", { ascending: false }) // orden por fecha descendente
    .order("id", { ascending: false }); // dentro de la misma fecha, último insertado primero

  if (error) {
    console.error("Error fetching monthly transactions:", error.message);
    return [];
  }

  return data || [];
};
