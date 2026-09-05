import React from "react";

const STATUS_CONFIGS = {
  // Employment & Contracts
  Running: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Expired: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  Draft: "bg-slate-500/10 text-slate-300 border-slate-500/30",

  // Attendance
  Present: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Late: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Overtime: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  "Missing Checkout": "bg-rose-500/10 text-rose-400 border-rose-500/30",

  // Leave & Payruns
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Computed: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Validated: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Paid: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Rejected: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  "On Leave": "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Terminated: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

const StatusBadge = ({ status, className = "" }) => {
  const badgeStyle = STATUS_CONFIGS[status] || "bg-slate-500/10 text-slate-300 border-slate-500/30";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
