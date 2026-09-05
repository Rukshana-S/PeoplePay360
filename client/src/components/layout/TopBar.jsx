import React from "react";
import { useAuth } from "../../context/AuthContext";
import { getRoleDisplayName, getRoleBadgeClass } from "../../utils/rolePermissions";
import { LogOut, ShieldCheck, User } from "lucide-react";
import { Button } from "../ui/button";

const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#0F172A] border-b border-[#1E293B] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand logo & tagline */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#5B8DEF] to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[#5B8DEF]/20">
          P360
        </div>
        <div>
          <h1 className="font-semibold text-white tracking-wide text-base leading-tight">
            PeoplePay360
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">
            HR & Payroll Operations
          </p>
        </div>
      </div>

      {/* User profile controls & Logout */}
      {user && (
        <div className="flex items-center gap-4">
          {/* Role badge */}
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getRoleBadgeClass(user.role)}`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{getRoleDisplayName(user.role)}</span>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 pl-2 border-l border-[#1E293B]">
            <div className="w-9 h-9 rounded-full bg-[#1E293B] border border-slate-700/60 flex items-center justify-center text-sm font-semibold text-slate-200 uppercase">
              {user.avatar || <User className="w-4 h-4 text-slate-400" />}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-100 leading-none">
                {user.name}
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-none">
                {user.email}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all ml-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      )}
    </header>
  );
};

export default TopBar;
