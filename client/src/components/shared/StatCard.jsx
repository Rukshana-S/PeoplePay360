import React from "react";

const StatCard = ({ title, value, subtitle, icon: Icon, color = "text-[#5B8DEF]" }) => {
  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2 relative overflow-hidden shadow-md hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between text-slate-400 text-xs">
        <span>{title}</span>
        {Icon && <Icon className={`w-4 h-4 ${color}`} />}
      </div>
      <p className="text-xl font-bold text-white tracking-tight">{value}</p>
      {subtitle && <span className={`text-[10px] font-medium block ${color}`}>{subtitle}</span>}
    </div>
  );
};

export default StatCard;
