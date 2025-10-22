export type Expense = {
  id: number;
  title: string;
  category: string;
  date: string;
  method: string;
  amount: number;
  note?: string;
};

export const expensesSeed: Expense[] = [
  {
    id: 1,
    title: "Uber to Office",
    category: "Transportation",
    date: "2025-01-15",
    method: "digital wallet",
    amount: 12.0,
  },
  {
    id: 2,
    title: "Morning Coffee",
    category: "Food & Dining",
    date: "2025-01-15",
    method: "credit card",
    amount: 50.5,
    note: "Daily coffee at Starbucks",
  },
  {
    id: 3,
    title: "Grocery Shopping",
    category: "Groceries",
    date: "2025-01-14",
    method: "debit card",
    amount: 85.5,
    note: "Weekly grocery shopping",
  },
  {
    id: 4,
    title: "Netflix Subscription",
    category: "Entertainment",
    date: "2025-01-13",
    method: "credit card",
    amount: 15.99,
  },
  {
    id: 5,
    title: "Electricity Bill",
    category: "Bills & Utilities",
    date: "2025-01-12",
    method: "bank transfer",
    amount: 120.0,
    note: "Monthly electricity bill",
  },
  {
    id: 6,
    title: "New Headphones",
    category: "Shopping",
    date: "2025-01-10",
    method: "credit card",
    amount: 89.99,
  },
];

export const categories = [
  "Bills & Utilities",
  "Transportation",
  "Food & Dining",
  "Groceries",
  "Entertainment",
  "Shopping",
];
