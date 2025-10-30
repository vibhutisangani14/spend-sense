import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft } from "lucide-react";
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
  _id?: string;
  title: string;
  amount: number;
  categoryId: string;
  date: string;
  paymentMethodId: string;
  notes?: string;
  userId: string;
  receipt?: string;
}

const EditExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [receipt, setReceipt] = useState<string | null>(null);

  const [expense, setExpense] = useState<Expense>({
    title: "",
    amount: 0,
    categoryId: "",
    date: "",
    paymentMethodId: "",
    notes: "",
    userId: "",
    receipt: "",
  });
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenseRes, categoryRes, paymentRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/expenses/${id}`, {
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/categories`, {
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/paymentMethods`, {
            withCredentials: true,
          }),
        ]);

        const expenseData = expenseRes.data;
        setExpense({
          _id: expenseData._id,
          title: expenseData.title || "",
          amount: expenseData.amount || 0,
          categoryId: expenseData.categoryId?._id || "",
          date: expenseData.date?.slice(0, 10) || "",
          paymentMethodId: expenseData.paymentMethodId?._id || "",
          notes: expenseData.notes || "",
          userId: expenseData.userId,
          receipt: expenseData.receipt || null,
        });

        setReceipt(expenseData.receipt || null);
        setUserId(expenseData.userId?._id || "");
        setCategories(categoryRes.data);
        setPaymentMethods(paymentRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: expense.title,
        amount: Number(expense.amount),
        categoryId: expense.categoryId,
        date: expense.date,
        paymentMethodId: expense.paymentMethodId,
        notes: expense.notes || "",
        userId,
        receipt: receipt || "",
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/expenses/${id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("✅ Expense updated:", response.data);
      navigate("/app");
    } catch (err: any) {
      console.error("❌ Error updating expense:", err.response?.data || err);
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setReceipt(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!expense) return <div className="p-6">Expense not found</div>;

  return (
    <div className="min-h-screen bg-white py-3 px-6 flex flex-col mx-18 justify-center">
      <div className="flex flex-col items-start justify-between mt-6">
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

          <h1 className="text-4xl font-bold bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] bg-clip-text text-transparent my-2">
            Edit Expense
          </h1>
          <p className="text-gray-600">Update your expense details</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Starbucks coffee, Uber ride, Netflix subscription"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={expense.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (€) *
                </label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={expense.amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  name="categoryId"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={expense.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={expense.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Method *
              </label>
              <select
                name="paymentMethodId"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={expense.paymentMethodId}
                onChange={handleChange}
                required
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method._id} value={method._id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

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

            <div>
              <label className="block text-sm font-medium mb-2">
                Receipt (Optional)
              </label>

              <label
                htmlFor="receipt-upload"
                className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-4 py-3 bg-[#f9f9fa] text-sm text-gray-700 cursor-pointer hover:border-indigo-500 hover:text-indigo-600 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4"
                  />
                </svg>
                <span className="font-medium">
                  {receipt ? "Receipt Selected" : "Upload Receipt"}
                </span>
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
              </label>

              {receipt && (
                <p className="mt-2 text-xs text-gray-500 truncate">
                  {receipt.substring(0, 40)}...
                </p>
              )}
            </div>

            {/* Action buttons */}
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

export default EditExpense;
