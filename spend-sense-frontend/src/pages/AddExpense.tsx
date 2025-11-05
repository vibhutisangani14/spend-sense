import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, Sparkles, Check, Upload } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [predictionTimeout, setPredictionTimeout] = useState<number | null>(
    null
  );
  const [categoryInput, setCategoryInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [expense, setExpense] = useState<Expense>({
    title: "",
    amount: 0,
    categoryId: "",
    date: new Date().toISOString().slice(0, 10),
    paymentMethodId: "",
    notes: "",
    userId: "",
  });
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

        setCategories(categoryRes.data);
        setPaymentMethods(paymentRes.data);

        const defaultCategory = categoryRes.data.find(
          (cat: Category) => cat.name.toLowerCase() === "other"
        );
        const defaultPayment = paymentRes.data.find(
          (pm: PaymentMethod) => pm.name.toLowerCase() === "credit card"
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

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
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
            `${import.meta.env.VITE_API_URL}/predict-category`,
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

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setReceipt(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addCustomCategory = async (name: string) => {
    if (!name.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/categories`,
        { name: name.trim() },
        { withCredentials: true }
      );
      setCategories((prev) => [...prev, res.data]);
      setExpense((prev) => ({ ...prev, categoryId: res.data._id }));
      setCategoryInput("");
      setDropdownOpen(false);
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Failed to add category. Try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    try {
      const payload = {
        ...expense,
        amount: Number(expense.amount),
        userId: user._id,
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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-white py-9 px-6 flex flex-col sm:mx-18 justify-center">
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
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold bg-[linear-gradient(135deg,#5344e5,#7c4bed,#9035ea)] bg-clip-text text-transparent my-2">
          Add Expense
        </h1>
        <p className="text-gray-600">Record your spending details</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-full bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold py-5 px-6">Expense Details</h2>
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
                placeholder="e.g., Starbucks coffee, Uber ride"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Type a description and AI will suggest the best category
              </p>

              {loadingCategory && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="animate-spin">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm text-indigo-700 font-medium">
                      Analyzing expense...
                    </span>
                  </div>
                </motion.div>
              )}

              {prediction && !loadingCategory && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-700">
                        AI suggests:{" "}
                        <span className="font-semibold text-black ml-1">
                          {prediction}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                      onClick={() => {
                        const match = categories.find(
                          (c) =>
                            c.name.toLowerCase() === prediction.toLowerCase()
                        );
                        match
                          ? setExpense((prev) => ({
                              ...prev,
                              categoryId: match._id,
                            }))
                          : addCustomCategory(prediction);
                        setPrediction(null);
                      }}
                    >
                      <Check className="w-4 h-4" /> Accept
                    </button>
                  </div>
                </motion.div>
              )}
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

              {/* CATEGORY DROPDOWN */}
              <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  placeholder="Select a category"
                  value={
                    categories.find((c) => c._id === expense.categoryId)
                      ?.name || ""
                  }
                  readOnly
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
                {dropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {categories.map((cat) => (
                      <div
                        key={cat._id}
                        className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                        onClick={() => {
                          setExpense((prev) => ({
                            ...prev,
                            categoryId: cat._id,
                          }));
                          setDropdownOpen(false);
                        }}
                      >
                        {cat.name}
                      </div>
                    ))}
                    <div className="flex gap-2 px-4 py-2 border-t border-gray-200">
                      <input
                        type="text"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        placeholder="Add new category"
                        className="flex-1 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                      />
                      <button
                        type="button"
                        className="bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] text-white px-3 py-1 rounded-lg  transition text-sm font-semibold"
                        onClick={() => addCustomCategory(categoryInput)}
                      >
                        Add
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
                  {paymentMethods.map((pm) => (
                    <option key={pm._id} value={pm._id}>
                      {pm.name}
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
                value={expense.notes}
                onChange={handleChange}
                placeholder="Add any additional details..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-sm focus:outline-none focus:ring-2 focus:ring-black"
                rows={3}
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
                <Upload className="w-4 h-4 text-gray-600" />
                <span>{receipt ? "Receipt Selected" : "Upload Receipt"}</span>
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
              </label>
              {receipt && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-green-600" /> Receipt added
                  successfully
                </motion.p>
              )}
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
                <Save className="w-4 h-4" /> Save Expense
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddExpense;
