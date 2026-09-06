import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CalendarCheck, Clock } from "lucide-react";

const SmartButtons = ({ employeeId, contractsCount = 1, attendanceCount = 8, timeOffCount = 2 }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => navigate(`/employees/${employeeId}/contracts`)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:border-[#5B8DEF]/40 text-slate-300 hover:text-white transition-all text-xs group"
      >
        <FileText className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
        <div className="text-left leading-tight">
          <span className="block font-bold text-white text-sm">{contractsCount}</span>
          <span className="text-[11px] text-slate-400">Contracts</span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => navigate(`/employees/${employeeId}/attendance`)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:border-[#5B8DEF]/40 text-slate-300 hover:text-white transition-all text-xs group"
      >
        <CalendarCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        <div className="text-left leading-tight">
          <span className="block font-bold text-white text-sm">{attendanceCount}</span>
          <span className="text-[11px] text-slate-400">Attendance</span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => navigate(`/employees/${employeeId}/timeoff`)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:border-[#5B8DEF]/40 text-slate-300 hover:text-white transition-all text-xs group"
      >
        <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        <div className="text-left leading-tight">
          <span className="block font-bold text-white text-sm">{timeOffCount}</span>
          <span className="text-[11px] text-slate-400">Time Off</span>
        </div>
      </button>
    </div>
  );
};

export default SmartButtons;
