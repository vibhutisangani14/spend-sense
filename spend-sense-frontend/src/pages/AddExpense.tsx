import React from "react";
import { Save, ArrowLeft } from "lucide-react";

const AddExpense: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-3 px-6 flex flex-col mx-18 justify-center">
      <div className="flex flex-col items-start justify-between">
        <button
          type="button"
          className="flex items-center gap-2 text-black font-medium text-sm px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] bg-clip-text text-transparent my-2">
          Add New Expense
        </h1>
        <p className="text-gray-600 mb-8">Record your spending details</p>
      </div>

      <div className="w-full  bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mt-3 mb-3 py-1.5 px-6">
          Expense Details
        </h2>
        <div className="border border-gray-100"></div>
        <form className="space-y-6 p-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              placeholder="e.g., Starbucks coffee, Uber ride, Netflix subscription"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:border-b-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:border-b-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 focus:outline-none text-sm focus:ring-2 focus:ring-indigo-400">
                <option>Other</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Subscription</option>
                <option>Entertainment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950  text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white focus:border-blue-600"
                defaultValue="2025-10-22"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Method
              </label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950  text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option>Cash</option>
                <option>Card</option>
                <option>Online</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              placeholder="Add any additional details..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950  text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white focus:border-blue-600"
              rows={3}
            ></textarea>
          </div>
          <div className="flex flex-row gap-2">
            <button
              type="button"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa]  flex-1 text-sm text-black font-semibold  hover:bg-indigo-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] flex  flex-1 items-center justify-center gap-2 text-sm text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
            >
              <Save className="w-4 h-4" />
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
