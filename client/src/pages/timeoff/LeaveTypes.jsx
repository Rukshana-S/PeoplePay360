import React from "react";
import { useNavigate } from "react-router-dom";
import { TIME_OFF_TYPES } from "../../data/timeOff";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { Check, X } from "lucide-react";
import { toast } from "react-toastify";

const LeaveTypes = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="timeOffRequests" moduleName="Leave Types Configuration" />

      {/* Navigation Sub-bar */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
        <button
          onClick={() => navigate("/time-off/requests")}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          Leave Requests
        </button>
        <button
          onClick={() => navigate("/time-off/allocations")}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          Allocations
        </button>
        <button
          onClick={() => navigate("/time-off/types")}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#5B8DEF] text-white"
        >
          Leave Types
        </button>
      </div>

      <PageHeader
        title="Leave Types"
        subtitle="Configure leave rules, tracking units, allocation requirements, and payroll impact"
        actionLabel="New Leave Type"
        onActionClick={() => toast.info("New Leave Type form ready.")}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Leave Type Name</th>
              <th className="py-3.5 px-4">Code</th>
              <th className="py-3.5 px-4">Tracking Unit</th>
              <th className="py-3.5 px-4">Requires Allocation</th>
              <th className="py-3.5 px-4">Payroll Affects</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {TIME_OFF_TYPES.map((lt) => (
              <tr key={lt.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${lt.color}`}>{lt.code}</span>
                  <span>{lt.name}</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400">{lt.code}</td>
                <td className="py-3.5 px-4 text-slate-300">{lt.unit}</td>
                <td className="py-3.5 px-4">
                  {lt.requiresAllocation ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1"><X className="w-3.5 h-3.5" /> No</span>
                  )}
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-200">{lt.payrollAffects}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveTypes;
