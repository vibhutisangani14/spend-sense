import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="text-gray-300 flex-col min-h-screen">
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
