import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Plus, Wallet } from "lucide-react";
const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#fafafa]">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-lg">ExpenseFlow</div>
          <div className="text-xs text-slate-400">Track your spending</div>
        </div>
      </div>

      <nav className="p-4">
        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-1.5 rounded-xl text-sm ${
              isActive
                ? " bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] text-white font-semibold text-sm"
                : "text-slate-600"
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </NavLink>

        <NavLink
          to="/app/addExpense"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-1.5 text-sm mt-3 rounded-lg ${
              isActive
                ? "bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] text-white font-semibold text-sm"
                : "text-slate-600"
            }`
          }
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </NavLink>
      </nav>

      <div className="absolute bottom-6 left-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
          S
        </div>
        <div>
          <div className="text-sm font-medium">Siri Sindhu</div>
          <div className="text-xs text-slate-400">siri.sindhu@gmail.com</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
