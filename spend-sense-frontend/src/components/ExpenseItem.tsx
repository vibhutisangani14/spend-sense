import React from "react";

interface APIExpense {
  id: string;
  title: string;
  amount: number;
  category: string;
  method: string;
  date: string;
  note?: string;
}

const ExpenseItem: React.FC<{ e: APIExpense }> = ({ e }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white expense-item card-shadow mb-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center">
          🧾
        </div>
        <div>
          <div className="font-semibold">{e.title}</div>
          <div className="text-xs text-slate-400 mt-1">
            <span className="badge badge-sm">
              {e.category || "Uncategorized"}
            </span>
            <span className="ml-2">
              {new Date(e.date).toLocaleDateString()}
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
