import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#020817] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-[#5B8DEF]/30 selection:text-white">
      {/* Background subtle glow accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5B8DEF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main content container */}
      <div className="w-full max-w-md z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
