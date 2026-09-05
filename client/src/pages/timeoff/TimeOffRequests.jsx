import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TIME_OFF_REQUESTS } from "../../data/timeOff";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { Check, X, Clock } from "lucide-react";
import { toast } from "react-toastify";

const TimeOffRequests = () => {
  const [requests, setRequests] = useState(TIME_OFF_REQUESTS);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleApprove = (id, e) => {
    e.stopPropagation();
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
    toast.success("Leave request approved successfully!");
  };

  const handleReject = (id, e) => {
    e.stopPropagation();
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    );
    toast.error("Leave request rejected.");
  };

  const filteredRequests = requests.filter((r) =>
    r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    r.leaveType.toLowerCase().includes(search.toLowerCase()) ||
    r.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="timeOffRequests" moduleName="Time Off Requests" />

      {/* Navigation Sub-bar */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
        <button
          onClick={() => navigate("/time-off/requests")}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#5B8DEF] text-white"
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
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          Leave Types
        </button>
      </div>

      <PageHeader
        title="Time Off Requests"
        subtitle="Manage employee vacation, sick leave, and casual leave applications"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="New Request"
        onActionClick={() => toast.info("New Leave Request form ready.")}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Leave Type</th>
              <th className="py-3.5 px-4">Period Dates</th>
              <th className="py-3.5 px-4">Duration</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {filteredRequests.map((req) => (
              <tr
                key={req.id}
                onClick={() => navigate(`/time-off/requests/${req.id}`)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-bold text-white">{req.employeeName}</td>
                <td className="py-3.5 px-4 text-slate-300">{req.leaveType}</td>
                <td className="py-3.5 px-4 text-slate-400">{req.startDate} to {req.endDate}</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-400">{req.duration}</td>
                <td className="py-3.5 px-4"><StatusBadge status={req.status} /></td>
                <td className="py-3.5 px-4 text-right">
                  {req.status === "Pending" ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => handleApprove(req.id, e)}
                        className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-[11px] font-semibold flex items-center gap-1"
                        title="Approve Request"
                      >
                        <Check className="w-3 h-3" /> Approve
                      </button>
                      <button
                        onClick={(e) => handleReject(req.id, e)}
                        className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 text-[11px] font-semibold flex items-center gap-1"
                        title="Reject Request"
                      >
                        <X className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeOffRequests;
