import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleDisplayName, getRoleBadgeClass, canAccessModule } from "../utils/rolePermissions";
import {
  Users,
  FileText,
  CalendarCheck,
  Clock,
  CircleDollarSign,
  BarChart3,
  UserCog,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const MODULE_CARDS = [
  {
    id: "employees",
    key: "employees",
    path: "/employees",
    title: "Employees",
    description: "Manage employee profiles, onboarding, directories, and organograms.",
    icon: Users,
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    badge: "Core HR",
  },
  {
    id: "contracts",
    key: "contracts",
    path: "/contracts",
    title: "Contracts",
    description: "Employment terms, salary structures, contract renewals, and compliance.",
    icon: FileText,
    color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30",
    badge: "Legal & HR",
  },
  {
    id: "attendance",
    key: "attendance",
    path: "/attendance",
    title: "Attendance",
    description: "Track daily clock-ins, biometric integrations, shift schedules, and logs.",
    icon: CalendarCheck,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
    badge: "Operations",
  },
  {
    id: "time-off",
    key: "timeOffRequests",
    path: "/time-off/requests",
    title: "Time Off",
    description: "Leave requests, vacation balances, sick leaves, and manager approvals.",
    icon: Clock,
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
    badge: "Self Service",
  },
  {
    id: "payroll",
    key: "payruns",
    path: "/payroll/payruns",
    title: "Payroll",
    description: "Salary processing, tax deductions, payslip generation, and bank disburse.",
    icon: CircleDollarSign,
    color: "from-sky-500/20 to-blue-600/10 border-sky-500/30",
    badge: "Finance",
  },
  {
    id: "reports",
    key: "reports",
    path: "/reports",
    title: "Reports & Analytics",
    description: "Headcount metrics, payroll expense analytics, turnover reports, and exports.",
    icon: BarChart3,
    color: "from-[#5B8DEF]/20 to-indigo-500/10 border-[#5B8DEF]/30",
    badge: "Analytics",
  },
  {
    id: "user-management",
    key: "users",
    path: "/users",
    title: "User Management",
    description: "System roles, granular permissions, security audit logs, and access control.",
    icon: UserCog,
    color: "from-pink-500/20 to-rose-500/10 border-pink-500/30",
    badge: "Admin",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "EMPLOYEE";

  // Filter modules permitted for the logged in user's role
  const allowedCards = MODULE_CARDS.filter((card) => canAccessModule(role, card.key));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header Banner */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#5B8DEF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5B8DEF]/20 border border-[#5B8DEF]/30 text-[#5B8DEF] text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Active Session
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadgeClass(user?.role)}`}>
                {getRoleDisplayName(user?.role)}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || "User"}!
            </h1>

            <p className="text-slate-400 text-sm max-w-xl">
              You are signed in as <span className="text-slate-200 font-semibold">{getRoleDisplayName(user?.role)}</span> in{" "}
              <span className="text-slate-200 font-semibold">{user?.department || "General"}</span>. Only modules assigned to your role are shown below.
            </p>
          </div>

          <div className="bg-[#020817] border border-[#1E293B] p-4 rounded-xl flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium font-mono">Role Permission Active</p>
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {allowedCards.length} Modules Permitted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Permitted Modules Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Assigned Modules ({getRoleDisplayName(role)})
            </h2>
            <p className="text-xs text-slate-400">
              Operational workspaces permitted for your role level.
            </p>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-mono">
            {allowedCards.length} Available
          </span>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allowedCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                onClick={() => navigate(card.path)}
                className="bg-[#0F172A] border border-[#1E293B] hover:border-[#5B8DEF]/50 rounded-xl p-5 cursor-pointer transition-all duration-200 group flex flex-col justify-between relative overflow-hidden shadow-md hover:shadow-lg hover:shadow-[#5B8DEF]/10"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`} />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#020817] border border-[#1E293B] flex items-center justify-center text-slate-300 group-hover:text-[#5B8DEF] group-hover:border-[#5B8DEF]/40 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-base group-hover:text-[#5B8DEF] transition-colors flex items-center gap-1.5">
                    {card.title}
                    <ArrowUpRight className="w-4 h-4 text-[#5B8DEF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Authorized Access
                  </span>
                  <span className="text-[#5B8DEF] font-semibold group-hover:underline">
                    Open Module →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
