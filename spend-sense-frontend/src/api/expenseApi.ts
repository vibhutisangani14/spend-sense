export interface ExpenseResponse {
  _id: string;
  title: string;
  amount: number;
  categoryId?: { name: string };
  userId?: { name: string };
  paymentMethodId?: { name: string };
  date: string;
  notes?: string;
}

export interface Category {
  _id: string;
  name: string;
}

const API_BASE = import.meta.env.VITE_API_URL;

export const fetchExpenses = async () => {
  const token =
    localStorage.getItem("spendsense_token") ||
    sessionStorage.getItem("spendsense_token");

  try {
    const res = await fetch(`${API_BASE}/expenses`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 401)
        throw new Error("Unauthorized: please log in again");
      throw new Error("Failed to fetch expenses");
    }

    const data: ExpenseResponse[] = await res.json();

    return data.map((e) => ({
      _id: e._id,
      title: e.title,
      amount: e.amount,
      category: e.categoryId?.name || "Uncategorized",
      method: e.paymentMethodId?.name || "Unknown",
      date: e.date,
      note: e.notes || "",
    }));
  } catch (err) {
    console.error("❌ Error fetching expenses:", err);
    throw err;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  const token =
    localStorage.getItem("spendsense_token") ||
    sessionStorage.getItem("spendsense_token");

  try {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
    throw err;
  }
};
