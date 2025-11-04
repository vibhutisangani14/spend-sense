import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { PanelLeft } from "lucide-react";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex relative" data-theme="expenseflow">
      {/* Mobile Header */}
      <header className="flex items-center sm:hidden fixed top-0 left-0 right-0 bg-white px-4 py-3 shadow-md z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <PanelLeft className="w-4 h-4 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold pl-3 bg-gradient-to-r from-[#5344e5] via-[#7c4bed] to-[#9035ea] bg-clip-text text-transparent">
          SpendSense
        </h1>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main content */}
      <main className="flex-1 bg-[url('')] min-h-screen transition-all duration-300 mt-16 sm:mt-0 sm:ml-64">
        <Outlet />
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
