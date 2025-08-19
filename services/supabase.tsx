import { Transaction } from "../interfaces";
import { supabase } from "../utils/supabase";

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
  // Aseguramos que devuelva la fila insertada
  const { data, error } = await supabase
    .from("transactions")
    .insert([transaction])
    .select("*"); // <--- importante para que devuelva la fila creada

  if (error) {
    console.error("Error adding transaction:", error.message);
    return null;
  }

  return data?.[0] || null;
};

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
