import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft } from "lucide-react";

interface Expense {
  id?: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
  notes?: string;
  receipt?: File | null;
}

const EditExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);

  const [expense, setExpense] = useState<Expense>({
    title: "Online Course",
    amount: 99,
    category: "Education",
    date: "2025-01-18",
    paymentMethod: "Credit Card",
    notes: "",
    receipt: null,
  });

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/expenses/${id}`);
        setExpense(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load expense");
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && expense) {
      setExpense({ ...expense, receipt: file });
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;

    try {
      const formData = new FormData();
      Object.entries(expense).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value as any);
      });

      await axios.put(`http://localhost:3000/api/expenses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Expense updated successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  if (loading) return <div className="p-6">Loading...</div>;
  if (!expense) return <div className="p-6">Expense not found</div>;

  return (
    <div className="min-h-screen bg-white py-3 px-6 flex flex-col mx-18 justify-center">
      <div className="flex flex-col items-start justify-between">
        <button
          type="button"
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

      <div className="w-full  bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mt-3 mb-3 py-1.5 px-6">
          Expense Details
        </h2>
        <div className="border border-gray-100"></div>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Starbucks coffee, Uber ride, Netflix subscription"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:border-b-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white focus:border-blue-600"
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
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:border-b-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white focus:border-blue-600"
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
                name="category"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 focus:outline-none text-sm focus:ring-2 focus:ring-indigo-400"
                value={expense.category}
                onChange={handleChange}
                required
              >
                <option>Other</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Subscription</option>
                <option>Entertainment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <input
                type="date"
                name="date"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950  text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white focus:border-blue-600"
                defaultValue="2025-10-22"
                value={expense.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950  text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={expense.paymentMethod}
              onChange={handleChange}
            >
              <option>Cash</option>
              <option>Card</option>
              <option>Online</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              name="notes"
              placeholder="Add any additional details..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950  text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white focus:border-blue-600"
              rows={3}
              value={expense.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Receipt (Optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleButtonClick}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] flex-1 text-sm text-black font-semibold hover:bg-indigo-700 transition"
            >
              Upload Receipt
            </button>
          </div>

          <div className="flex flex-row gap-2">
            <button
              type="button"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa]  flex-1 text-sm text-black font-semibold  hover:bg-indigo-700 transition"
            >
              Delete
            </button>
            <button
              type="button"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa]  flex-3 text-sm text-black font-semibold  hover:bg-indigo-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] flex  flex-3 items-center justify-center gap-2 text-sm text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
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
