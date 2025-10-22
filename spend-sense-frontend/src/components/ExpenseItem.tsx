import React from "react";
import type { Expense } from "../data/expenses";

const ExpenseItem: React.FC<{ e: Expense }> = ({ e }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white expense-item card-shadow mb-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center">
          🧾
        </div>
        <div>
          <div className="font-semibold">{e.title}</div>
          <div className="text-xs text-slate-400 mt-1">
            <span className="badge badge-sm">{e.category}</span>
            <span className="ml-2">
              {e.date} • {e.method}
            </span>
          </div>
          {e.note && (
            <div className="text-xs text-slate-400 mt-2">{e.note}</div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">${e.amount.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ExpenseItem;
