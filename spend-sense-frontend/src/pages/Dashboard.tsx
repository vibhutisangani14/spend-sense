import React, { useMemo } from "react";
import SummaryCard from "../components/SummaryCard";
import ExpenseItem from "../components/ExpenseItem";
import { expensesSeed } from "../data/expenses";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

const COLORS = [
  "#7c3aed",
  "#34d399",
  "#60a5fa",
  "#98d8c8",
  "#f47171",
  "#4ecdc4",
  "#ffa500",
];

const Dashboard: React.FC = () => {
  const expenses = expensesSeed;

  const total = useMemo(
    () => expenses.reduce((s, a) => s + a.amount, 0),
    [expenses]
  );
  const average = useMemo(
    () => (expenses.length ? total / expenses.length : 0),
    [total, expenses.length]
  );

  const pieData = useMemo(() => {
    const agg: Record<string, number> = {};
    expenses.forEach((e) => {
      agg[e.category] = (agg[e.category] || 0) + e.amount;
    });
    return Object.entries(agg).map(([name, value], i) => ({
      name,
      value: +value.toFixed(2),
      color: COLORS[i % COLORS.length],
    }));
  }, [expenses]);

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl header-title">Expense Dashboard</h1>
          <p className="text-slate-400 mt-2">Track and manage your spending</p>
        </div>
        <Link to="/add" className="btn btn-gradient px-5 py-2 rounded-xl">
          + Add Expense
        </Link>
      </div>
      <div className="col-span-12 lg:col-span-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

      <div className="grid grid-cols-12 gap-6 mt-8 lg:col-span-12">
        <div className="mt-6 p-6 bg-white rounded-2xl card-shadow lg:col-span-8">
          <div className="mb-4">
            <div className="font-semibold">Filters</div>
            <div className="text-xs text-slate-400">All Categories • Date</div>
          </div>

          <div className="mt-4">
            {expenses.map((e) => (
              <ExpenseItem key={e.id} e={e} />
            ))}
          </div>
        </div>
        <div className="p-6 bg-white rounded-2xl card-shadow h-full lg:col-span-4">
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
    </div>
  );
};

export default Dashboard;
