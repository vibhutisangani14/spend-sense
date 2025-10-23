import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft } from "lucide-react";

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
  receipt?: File | null;
}

const EditExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [expense, setExpense] = useState<Expense>({
    title: "",
    amount: 0,
    categoryId: "",
    date: "",
    paymentMethodId: "",
    notes: "",
    userId: "",
    receipt: null,
  });

  const [userId, setUserId] = useState<string>("");

  //Fetch expense, categories, and payment methods
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenseRes, categoryRes, paymentRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/expenses/${id}`),
          axios.get(`http://localhost:3000/api/categories`),
          axios.get(`http://localhost:3000/api/paymentMethods`),
        ]);

        const expenseData = expenseRes.data;
        setExpense({
          _id: expenseData._id,
          title: expenseData.title || "",
          amount: expenseData.amount || 0,
          categoryId: expenseData.categoryId?._id || "",
          date: expenseData.date?.slice(0, 10) || "",
          paymentMethodId: expenseData.paymentMethodId || "",
          notes: expenseData.notes || "",
          userId: expenseData.userId,
          receipt: null,
        });

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

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // JSON payload
      const payload = {
        title: expense.title,
        amount: Number(expense.amount),
        categoryId: expense.categoryId,
        date: expense.date,
        // paymentMethodId: expense.paymentMethodId,
        // notes: expense.notes || "",
        userId,
      };
      console.log("Sending payload:", payload);

      const response = await axios.put(
        `http://localhost:3000/api/expenses/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Expense updated:", response.data);
      navigate("/app");
    } catch (err: any) {
      console.error("❌ Error updating expense:", err.response?.data || err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!expense) return <div className="p-6">Expense not found</div>;

  return (
    <div className="min-h-screen bg-white py-3 px-6 flex flex-col mx-18 justify-center">
      <div className="flex flex-col items-start justify-between">
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
        <p className="text-gray-600 mb-8">Update your expense details</p>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mt-3 mb-3 py-1.5 px-6">
          Expense Details
        </h2>
        <div className="border border-gray-100"></div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Title + Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
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
                Amount ($) *
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

          {/* Category + Date */}
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

          {/* Payment method */}
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

          {/* Notes */}
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
    </div>
  );
};

export default EditExpense;
