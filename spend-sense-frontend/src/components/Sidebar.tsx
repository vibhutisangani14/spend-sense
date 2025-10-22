import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
}

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("spendsense_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#fafafa] ">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7h18M3 12h18M3 17h18"
            />
          </svg>
        </div>
        <div>
          <div className="font-bold text-lg">ExpenseFlow</div>
          <div className="text-xs text-slate-400">Track your spending</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg ${
              isActive
                ? "bg-gradient-to-r from-[#efeaff] to-[#fff0fb] text-purple-700 font-semibold"
                : "text-slate-600"
            }`
          }
        >
          <span className="w-8 h-8 rounded-md flex items-center justify-center bg-white card-shadow">
            📊
          </span>
          Dashboard
        </NavLink>

        <NavLink
          to="/app/addExpense"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 mt-3 rounded-lg ${
              isActive
                ? "bg-purple-50 text-purple-700 font-semibold"
                : "text-slate-600"
            }`
          }
        >
          <span className="w-8 h-8 rounded-md flex items-center justify-center bg-white card-shadow">
            ➕
          </span>
          Add Expense
        </NavLink>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
          {user ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div>
          <div className="text-sm font-medium">
            {user?.name || "Guest User"}
          </div>
          <div className="text-xs text-slate-400">
            {user?.email || "guest@example.com"}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
