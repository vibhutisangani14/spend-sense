import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import SummaryCard from "../components/SummaryCard";
import ExpenseItem from "../components/ExpenseItem";
import { Plus } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { fetchExpenses, fetchCategories } from "../api/expenseApi";
import { FcEmptyFilter } from "react-icons/fc";

const COLORS = [
  "#7c3aed",
  "#34d399",
  "#60a5fa",
  "#98d8c8",
  "#f47171",
  "#4ecdc4",
  "#ffa500",
];

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  method?: string;
  date: string;
  note?: string;
}

interface Category {
  _id: string;
  name: string;
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortType, setSortType] = useState<
    "date-newest" | "date-oldest" | "amount-high" | "amount-low"
  >("date-newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [exp, cats, methods] = await Promise.all([
          fetchExpenses(),
          fetchCategories(),
          fetch("http://localhost:3000/api/paymentMethods").then((res) =>
            res.json()
          ),
        ]);

        const mapped = exp.map((e: any) => ({
          _id: e._id,
          title: e.title,
          amount: e.amount,
          category: e.categoryId?.name || e.category || "Other",
          method: e.paymentMethod || "Unknown",
          date: e.date,
          note: e.notes || "",
        }));

        setExpenses(mapped);
        setCategories(cats);
        setPaymentMethods(methods);
      } catch (err: any) {
        console.error("❌ Error loading data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location.pathname]);

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    if (selectedCategory !== "all") {
      result = result.filter((e) => e.category === selectedCategory);
    }
    result.sort((a, b) => {
      if (sortType === "date-newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortType === "date-oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortType === "amount-high") return b.amount - a.amount;
      if (sortType === "amount-low") return a.amount - b.amount;
      return 0;
    });
    return result;
  }, [expenses, selectedCategory, sortType]);

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const average =
    filteredExpenses.length > 0 ? total / filteredExpenses.length : 0;

  const pieData = useMemo(() => {
    const agg: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      agg[e.category] = (agg[e.category] || 0) + e.amount;
    });
    return Object.entries(agg).map(([name, value], i) => ({
      name,
      value,
      color: COLORS[i % COLORS.length],
    }));
  }, [filteredExpenses]);

  const barData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyTotals: Record<string, number> = {};
    months.forEach((month) => {
      monthlyTotals[month] = 0;
    });
    filteredExpenses.forEach((e) => {
      const date = new Date(e.date);
      const month = months[date.getMonth()];
      monthlyTotals[month] = (monthlyTotals[month] || 0) + e.amount;
    });
    return months.map((month) => ({
      month,
      amount: monthlyTotals[month] || 0,
    }));
  }, [filteredExpenses]);

  // Calculate total for current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  if (loading) return <div className="p-6 text-slate-400">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-500">Error loading data: {error}</div>;

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="flex items-center mb-6 justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-[linear-gradient(135deg,#5344e5,#7c4bed,#9035ea)] bg-clip-text text-transparent">
            Expense Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Track and manage your spending</p>
        </div>
        <Link
          to="/app/addExpense"
          className="btn bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] text-white shadow-xl px-5 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </Link>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Expenses"
            value={`€${total.toFixed(2)}`}
            subtitle={`${expenses.length} transactions`}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 1.343-3 3v5h6v-5c0-1.657-1.343-3-3-3z"
                />
              </svg>
            }
          />
          <SummaryCard
            title="This Month"
            value={`€${thisMonthTotal.toFixed(2)}`}
            subtitle="First month"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <SummaryCard
            title="Average Expense"
            value={`€${average.toFixed(2)}`}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 11V3m0 0L7 7m4-4 4 4M3 21h18"
                />
              </svg>
            }
          />
          <SummaryCard
            title="Payment Methods"
            value={paymentMethods.length.toString()}
            subtitle="Active methods"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h.01M11 15h.01M15 15h.01"
                />
              </svg>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-8 lg:col-span-12">
        <div className="p-6 bg-white rounded-xl card-shadow h-full lg:col-span-6">
          <h2 className="font-semibold text-lg mb-2">📊 Spending Trends</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-white rounded-xl card-shadow h-full lg:col-span-6">
          <h2 className="font-semibold text-lg mb-2">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name + index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl card-shadow mt-8">
        <div className="flex flex-wrap gap-2 items-center">
          <FcEmptyFilter className="text-purple-600 h-6 w-6" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm text-slate-600"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sortType}
            onChange={(e) =>
              setSortType(
                e.target.value as
                  | "date-newest"
                  | "date-oldest"
                  | "amount-high"
                  | "amount-low"
              )
            }
            className="border rounded-lg px-4 py-2 text-sm text-slate-600"
          >
            <option value="date-newest">Date (Newest)</option>
            <option value="date-oldest">Date (Oldest)</option>
            <option value="amount-high">Amount (High → Low)</option>
            <option value="amount-low">Amount (Low → High)</option>
          </select>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl card-shadow mt-8">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((e) => <ExpenseItem key={e._id} e={e} />)
        ) : (
          <div className="text-slate-400 text-sm">
            No expenses match this filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
