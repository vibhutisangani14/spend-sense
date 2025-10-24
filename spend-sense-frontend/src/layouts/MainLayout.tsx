import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex" data-theme="expenseflow">
      <Sidebar />
      <main className="flex-1 bg-[url('')]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
