export interface ExpenseResponse {
  _id: string;
  title: string;
  amount: number;
  categoryId?: { name: string };
  method?: string;
  date: string;
  note?: string;
}

export interface Category {
  _id: string;
  name: string;
}

const API_BASE = "http://localhost:3000/api";

/**
 * Fetch all expenses
 */
export const fetchExpenses = async () => {
  const res = await fetch(`${API_BASE}/expenses`);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  const data: ExpenseResponse[] = await res.json();

  return data.map((e) => ({
    id: e._id,
    title: e.title,
    amount: e.amount,
    category: e.categoryId?.name || "Uncategorized",
    method: e.method || "Unknown",
    date: e.date,
    note: e.note || "",
  }));
};

/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};
