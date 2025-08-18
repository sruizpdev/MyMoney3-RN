// interfaces/transaction.ts
export interface Transaction {
  id: number;
  amount: number;
  date: string;
  description: string;
  type: "income" | "expense";
}
