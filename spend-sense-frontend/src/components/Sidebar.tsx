import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus, Wallet, LogOut } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
}

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("spendsense_token");
    localStorage.removeItem("spendsense_user");
    navigate("/signIn");
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#fafafa] overflow-hidden">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-lg">SpendSense</div>
          <div className="text-xs text-slate-400">Track your spending</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-1.5 rounded-xl text-sm ${
              isActive
                ? "bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] text-white font-semibold"
                : "text-slate-600 hover:bg-slate-100 transition-all"
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
                ? "bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] text-white font-semibold"
                : "text-slate-600 hover:bg-slate-100 transition-all"
            }`
          }
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </NavLink>
      </nav>

      {/* User Info + Logout */}
      <div className="absolute bottom-6 left-6 flex flex-col items-start gap-4 ">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
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
        <div className="w-54  rounded-xl hover:bg-red-100 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2  font-semibold text-sm px-2 py-2 rounded-lg "
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
