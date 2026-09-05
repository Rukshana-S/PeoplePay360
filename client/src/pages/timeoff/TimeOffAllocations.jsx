import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LEAVE_ALLOCATIONS } from "../../data/timeOff";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { toast } from "react-toastify";

const TimeOffAllocations = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredAllocations = LEAVE_ALLOCATIONS.filter((a) =>
    a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    a.leaveType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="leaveAllocations" moduleName="Leave Allocations" />

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
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#5B8DEF] text-white"
        >
          Allocations
        </button>
        <button
          onClick={() => navigate("/time-off/types")}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          Leave Types
        </button>
      </div>

      <PageHeader
        title="Leave Allocations"
        subtitle="Annual leave quotas, taken days, and remaining balances per employee"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="Allocate Leave"
        onActionClick={() => toast.info("Allocate Leave quota dialog ready.")}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Leave Type</th>
              <th className="py-3.5 px-4">Total Allocated</th>
              <th className="py-3.5 px-4">Days Taken</th>
              <th className="py-3.5 px-4">Remaining Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {filteredAllocations.map((alloc) => (
              <tr key={alloc.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">{alloc.employeeName}</td>
                <td className="py-3.5 px-4 text-slate-300">{alloc.leaveType}</td>
                <td className="py-3.5 px-4 text-slate-400">{alloc.allocated} Days</td>
                <td className="py-3.5 px-4 text-rose-400 font-medium">{alloc.taken} Days</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">{alloc.remaining} Days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeOffAllocations;
