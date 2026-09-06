import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import Sidebar from "../components/layout/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#020817] text-white flex flex-col font-sans">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto bg-[#020817]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
