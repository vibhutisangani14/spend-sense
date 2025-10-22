import React, { useEffect, useMemo, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import ExpenseItem from "../components/ExpenseItem";
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
import { Link } from "react-router-dom";
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
  id: string;
  title: string;
  amount: number;
  category: string;
  method: string;
  date: string;
  note?: string;
}

interface Category {
  _id: string;
  name: string;
}

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortType, setSortType] = useState<
    "date-newest" | "date-oldest" | "amount-high" | "amount-low"
  >("date-newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load data using the new API layer
  useEffect(() => {
    const loadData = async () => {
      try {
        const [exp, cats] = await Promise.all([
          fetchExpenses(),
          fetchCategories(),
        ]);
        setExpenses(exp);
        setCategories(cats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ✅ Filtering & sorting logic (unchanged)
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

  // Bar chart
  const barData = useMemo(() => {
    const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
    const monthlyTotals: Record<string, number> = {};

    months.forEach((month) => {
      monthlyTotals[month] = 0;
    });

    filteredExpenses.forEach((e) => {
      const date = new Date(e.date);
      const month = months[date.getMonth()]; // Adjust if your data spans multiple years
      monthlyTotals[month] = (monthlyTotals[month] || 0) + e.amount;
    });

    return months.map((month) => ({
      month,
      amount: monthlyTotals[month] || 0,
    }));
  }, [filteredExpenses]);

  if (loading) return <div className="p-6 text-slate-400">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-500">Error loading data: {error}</div>;

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="flex items-center mb-6 justify-between">
        <div>
          <h1 className="text-4xl header-title">Expense Dashboard</h1>
          <p className="text-slate-400 mt-2">Track and manage your spending</p>
        </div>
        <Link to="/add" className="btn btn-gradient px-5 py-2 rounded-l">
          + Add Expense
        </Link>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Expenses"
            value={`$${total.toFixed(2)}`}
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
            value="$0.00"
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
            value={`$${average.toFixed(2)}`}
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
            value="4"
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

      {/* Chart */}
      <div className="grid grid-cols-12 gap-6 mt-8 lg:col-span-12">
        {/* Bar Chart */}
        <div className="p-6 bg-white rounded-xl card-shadow h-full lg:col-span-6">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <span>📊 Spending Trends</span>
          </div>
          <p className="text-sm text-[#9ca3af]">Last 6 months overview</p>
          <div style={{ width: "100%", height: 320 }} className="mt-6">
            <ResponsiveContainer>
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
        </div>

        {/* Pie Chart */}
        <div className="p-6 bg-white rounded-xl card-shadow h-full lg:col-span-6">
          <div className="font-semibold text-lg">Spending by Category</div>
          <div style={{ width: "100%", height: 320 }} className="mt-6">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 bg-white rounded-xl card-shadow lg:col-span-8 mt-8">
        <div className="flex flex-wrap gap-2">
          <FcEmptyFilter className="text-purple-600 h-6 w-6 mt-1" />
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

      {/* Expenses */}
      <div className="p-6 bg-white rounded-xl card-shadow lg:col-span-8 mt-8">
        {/* Expense List */}
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((e) => <ExpenseItem key={e.id} e={e} />)
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
