import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canAccessModule, getRoleDisplayName } from "../../utils/rolePermissions";
import {
  LayoutDashboard,
  Users,
  FileText,
  CalendarCheck,
  Clock,
  CircleDollarSign,
  BarChart3,
  UserCog,
  CalendarDays,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { id: "dashboard", key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "employees", key: "employees", label: "Employees", icon: Users, path: "/employees" },
  { id: "contracts", key: "contracts", label: "Contracts", icon: FileText, path: "/contracts" },
  { id: "schedules", key: "schedules", label: "Schedules", icon: CalendarDays, path: "/working-schedules" },
  { id: "attendance", key: "attendance", label: "Attendance", icon: CalendarCheck, path: "/attendance" },
  { id: "timeoff", key: "timeOffRequests", label: "Time Off", icon: Clock, path: "/time-off/requests" },
  { id: "payroll", key: "payruns", label: "Payroll", icon: CircleDollarSign, path: "/payroll/payruns" },
  { id: "reports", key: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
  { id: "users", key: "users", label: "User Management", icon: UserCog, path: "/users" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || "EMPLOYEE";

  // Strict filtering: Render only menu items allowed by the user's assigned role matrix
  const allowedItems = SIDEBAR_ITEMS.filter((item) => canAccessModule(role, item.key));

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-[#1E293B] flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-[#1E293B]/60 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation Menu
        </p>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#5B8DEF]/10 text-[#5B8DEF] font-mono border border-[#5B8DEF]/20">
          {getRoleDisplayName(role)}
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? "bg-[#5B8DEF] text-white shadow-md shadow-[#5B8DEF]/25"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                }`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer info in sidebar */}
      <div className="p-4 border-t border-[#1E293B] bg-[#020817]/40">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>PeoplePay360 ERP</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">v1.0-rbac</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
