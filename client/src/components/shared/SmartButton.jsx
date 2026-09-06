import React from "react";

const SmartButton = ({ icon: Icon, label, count, onClick, color = "text-[#5B8DEF]" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:border-[#5B8DEF]/40 text-slate-300 hover:text-white transition-all text-xs group shadow-sm"
    >
      {Icon && <Icon className={`w-4 h-4 ${color} group-hover:scale-110 transition-transform`} />}
      <div className="text-left leading-tight">
        <span className="block font-bold text-white text-sm">{count}</span>
        <span className="text-[11px] text-slate-400">{label}</span>
      </div>
    </button>
  );
};

export default SmartButton;
