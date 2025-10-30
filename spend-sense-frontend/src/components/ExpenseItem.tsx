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
import { Pencil, Receipt } from "lucide-react";

interface APIExpense {
  e: {
    _id: string;
    title: string;
    amount: number;
    category: string;
    method: string;
    date: string;
    note?: string;
    receipt?: string;
  };
}

// Map your categories to icons
const categoryIcons: Record<string, React.ReactNode> = {
  Education: <FcReading className="text-3xl" />,
  "Food & Dining": <MdFastfood className="text-3xl" />,
  Transportation: <FcShipped className="text-3xl" />,
  Other: <FcEmptyFilter className="text-3xl" />,
  Shopping: <FcShop className="text-3xl" />,
  Entertainment: <FcSlrBackSide className="text-3xl" />,
  "Bills & Utilities": <FcHome className="text-3xl" />,
  Healthcare: <FcLike className="text-3xl" />,
  Travel: <FcGlobe className="text-3xl" />,
  Groceries: <GiShoppingCart className="text-3xl" />,
};

const ExpenseItem: React.FC<APIExpense> = ({ e }) => {
  const navigate = useNavigate();
  const Icon = categoryIcons[e.category] || <FcEmptyFilter />;

  const handleEdit = () => {
    navigate(`/app/editExpense/${e._id}`);
  };

  const handleReceiptDownload = (receiptBase64: string, title?: string) => {
    if (!receiptBase64) return;

    try {
      // Extract MIME type and base64 data
      const matches = receiptBase64.match(/^data:(.*?);base64,(.*)$/);
      if (!matches) {
        console.error("Invalid base64 format");
        return;
      }

      const mimeType = matches[1]; // e.g. "image/jpeg"
      const base64Data = matches[2];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // Generate a downloadable URL
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const extension = mimeType.split("/")[1] || "file";
      link.download = `${title || "receipt"}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Failed to download receipt:", err);
    }
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
        {e.receipt && (
          <button
            type="button"
            onClick={() =>
              e.receipt && handleReceiptDownload(e.receipt, e.title)
            }
            title="Download Receipt"
            className="hover:text-purple-600 transition"
          >
            <Receipt size={20} />
          </button>
        )}

        <button type="button" onClick={handleEdit}>
          <Pencil size={20} />
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
