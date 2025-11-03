import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";

interface Category {
  _id: string;
  name: string;
}

interface PaymentMethod {
  _id: string;
  name: string;
}

interface Expense {
  title: string;
  amount: number;
  categoryId: string;
  date: string;
  paymentMethodId: string;
  notes?: string;
  userId: string;
}
interface User {
  _id: string;
  name: string;
  email: string;
}

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [predictionTimeout, setPredictionTimeout] = useState<number | null>(
    null
  );

  const [expense, setExpense] = useState<Expense>({
    title: "",
    amount: "" as unknown as number,
    categoryId: "",
    date: new Date().toISOString().slice(0, 10),
    paymentMethodId: "",
    notes: "",
    userId: "",
  });
  const [user, setUser] = useState<User | null>(null);

  // Custom category states
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("spendsense_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }

    const fetchData = async () => {
      try {
        const [categoryRes, paymentRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/categories`, {
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/paymentMethods`, {
            withCredentials: true,
          }),
        ]);

        const categoriesData = categoryRes.data;
        const paymentData = paymentRes.data;

        setCategories(categoriesData);
        setPaymentMethods(paymentData);

        const defaultCategory = categoriesData.find(
          (cat: Category) => cat.name.toLowerCase() === "other"
        );
        const defaultPayment = paymentData.find(
          (method: PaymentMethod) => method.name.toLowerCase() === "credit card"
        );

        setExpense((prev) => ({
          ...prev,
          categoryId: defaultCategory?._id || "",
          paymentMethodId: defaultPayment?._id || "",
        }));
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowAddInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));

    if (predictionTimeout) clearTimeout(predictionTimeout);

    if (name === "title" && value.trim().length >= 3) {
      const timeout = setTimeout(async () => {
        setLoadingCategory(true);
        try {
          const res = await fetch(
            "http://localhost:3000/api/predict-category",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: value }),
            }
          );
          const data = await res.json();
          setPrediction(data?.categoryName);
        } catch (err) {
          console.error(err);
          setPrediction("Error");
        } finally {
          setLoadingCategory(false);
        }
      }, 800);
      setPredictionTimeout(timeout);
    } else if (value.trim().length === 0) {
      setPrediction(null);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/categories`,
        { name: newCategory },
        { withCredentials: true }
      );
      setCategories((prev) => [...prev, res.data]);
      setExpense((prev) => ({ ...prev, categoryId: res.data._id }));
      setNewCategory("");
      setShowAddInput(false);
    } catch (err) {
      console.error("Error adding new category:", err);
      alert("Failed to add category");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...expense,
        amount: Number(expense.amount),
        userId: user?._id,
        receipt: receipt || "",
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/expenses`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      navigate("/app");
    } catch (err: any) {
      console.error("❌ Error adding expense:", err.response?.data || err);
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setReceipt(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-white py-9 px-6 flex flex-col sm:mx-18 justify-center">
      <div className="flex flex-col items-start justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            type="button"
            onClick={() => navigate("/app")}
            className="flex items-center gap-2 text-black font-medium text-sm px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold bg-[linear-gradient(135deg,#5344e5,#7c4bed,#9035ea)] bg-clip-text text-transparent my-2">
            Add Expense
          </h1>
          <p className="text-gray-600">Record your spending details</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-full bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mt-3 mb-3 py-1.5 px-6">
            Expense Details
          </h2>
          <div className="border border-gray-100"></div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={expense.title}
                onChange={handleChange}
                placeholder="e.g., Starbucks coffee, Uber ride, Netflix subscription"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* AMOUNT & CATEGORY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (€) *
                </label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  value={expense.amount}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* CATEGORY WITH INLINE ADD */}
              <div ref={dropdownRef} className="relative category-dropdown">
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <div
                  className="border border-gray-200 rounded-lg bg-[#f9f9fa] text-gray-950 text-sm px-4 py-2.5 cursor-pointer flex justify-between items-center focus-within:ring-2 focus-within:ring-indigo-400"
                  onClick={() => setShowAddInput((prev) => !prev)}
                >
                  <span>
                    {categories.find((c) => c._id === expense.categoryId)
                      ?.name || "Select category"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      showAddInput ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {showAddInput && (
                  <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-100 z-10 max-h-56 overflow-y-auto">
                    {categories.map((cat) => (
                      <div
                        key={cat._id}
                        onClick={() => {
                          setExpense((prev) => ({
                            ...prev,
                            categoryId: cat._id,
                          }));
                          setShowAddInput(false);
                        }}
                        className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 text-sm ${
                          expense.categoryId === cat._id
                            ? "bg-indigo-50 font-medium"
                            : ""
                        }`}
                      >
                        {cat.name}
                      </div>
                    ))}
                    <div className="border-t border-gray-100 my-1"></div>
                    <div className="p-3 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="New category..."
                        className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="text-indigo-600 font-medium text-sm hover:underline"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DATE & PAYMENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={expense.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethodId"
                  value={expense.paymentMethodId}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {paymentMethods.map((method) => (
                    <option key={method._id} value={method._id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* NOTES */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                placeholder="Add any additional details..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-sm focus:outline-none focus:ring-2 focus:ring-black"
                rows={3}
                value={expense.notes}
                onChange={handleChange}
              />
            </div>

            {/* RECEIPT */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Receipt (Optional)
              </label>
              <label
                htmlFor="receipt-upload"
                className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-4 py-3 bg-[#f9f9fa] text-sm text-gray-700 cursor-pointer hover:border-indigo-500 hover:text-indigo-600 transition-all"
              >
                <span>{receipt ? "Receipt Selected" : "Upload Receipt"}</span>
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-row gap-2">
              <button
                type="button"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-sm text-black font-semibold hover:bg-indigo-700 hover:text-white transition"
                onClick={() => navigate("/app")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] flex items-center justify-center gap-2 text-sm text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
              >
                <Save className="w-4 h-4" />
                Save Expense
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddExpense;
