import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getRoleDisplayName, getRoleBadgeClass } from "../../utils/rolePermissions";
import { LogOut, ShieldCheck, User, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {/* User info & Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center gap-3 pl-2 border-l border-[#1E293B] cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors"
              onClick={() => setProfileOpen(!profileOpen)}
            >
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

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-[#1E293B] bg-[#020817]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1E293B] border border-slate-700/60 flex items-center justify-center text-lg font-bold text-slate-200 uppercase">
                      {user.avatar || <User className="w-6 h-6 text-slate-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-white truncate max-w-[150px]">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Role</p>
                    <div className={`inline-flex px-2 py-1 rounded text-xs font-semibold border items-center gap-1.5 ${getRoleBadgeClass(user.role)}`}>
                      <ShieldCheck className="w-3 h-3" />
                      <span>{getRoleDisplayName(user.role)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Account ID</p>
                    <p className="text-xs font-mono text-slate-300 truncate">{user.id}</p>
                  </div>
                </div>
                <div className="p-2 border-t border-[#1E293B] space-y-1">
                  {user.employeeId && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate(`/profile`);
                      }}
                      className="w-full justify-start text-[#5B8DEF] hover:text-[#4a7ad8] hover:bg-[#5B8DEF]/10 h-9 px-3 rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Profile
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full justify-start text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-9 px-3 rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
