import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FcEmptyFilter,
  FcReading,
  FcShop,
  FcSlrBackSide,
  FcHome,
  FcLike,
  FcShipped,
  FcGlobe,
} from "react-icons/fc";
import { MdFastfood } from "react-icons/md";
import { GiShoppingCart } from "react-icons/gi";
import { Pencil } from "lucide-react";

interface APIExpense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  method: string;
  date: string;
  note?: string;
}

// Map your categories to icons
const categoryIcons: Record<string, React.ReactNode> = {
  Education: <FcReading />,
  "Food & Dining": <MdFastfood />,
  Transportation: <FcShipped />,
  Other: <FcEmptyFilter />,
  Shopping: <FcShop />,
  Entertainment: <FcSlrBackSide />,
  "Bills & Utilities": <FcHome />,
  Healthcare: <FcLike />,
  Travel: <FcGlobe />,
  Groceries: <GiShoppingCart />,
};

const ExpenseItem: React.FC<{ e: APIExpense }> = ({ e }) => {
  const navigate = useNavigate();
  const Icon = categoryIcons[e.category] || <FcEmptyFilter />;

  const handleEdit = () => {
    navigate(`/app/editExpense/${e._id}`);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white expense-item card-shadow mb-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center">
          {Icon}
        </div>
        <div>
          <div className="font-semibold">{e.title}</div>
          <div className="text-xs text-slate-400 mt-1">
            <span className="badge badge-sm">
              {e.category || "Uncategorized"}
            </span>
            <span className="ml-2">
              {new Date(e.date).toLocaleDateString()} . {e.method}
            </span>
          </div>
          {e.note && (
            <div className="text-xs text-slate-400 mt-2">{e.note}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-right">
        <div className="font-semibold">€{e.amount.toFixed(2)}</div>

        <button type="button" onClick={handleEdit}>
          <Pencil size={20} />
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
