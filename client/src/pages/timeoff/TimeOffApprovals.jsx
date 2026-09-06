import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimeOff } from "../../hooks/useTimeOff";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import { Check, X, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const TimeOffApprovals = () => {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';
  const { requests, loading, error, reviewRequest } = useTimeOff();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleApprove = async (id, e) => {
    e.stopPropagation();
    const res = await reviewRequest(id, "APPROVED");
    if (res.success) {
      toast.success("Request approved");
    } else {
      toast.error(res.error || "Failed to approve");
    }
  };

  const handleReject = async (id, e) => {
    e.stopPropagation();
    const res = await reviewRequest(id, "REJECTED");
    if (res.success) {
      toast.success("Request rejected");
    } else {
      toast.error(res.error || "Failed to reject");
    }
  };

  const filteredRequests = requests.filter((r) => {
    // Exclude HR's (or Admin's) own requests from approval view
    if (r.employee?.userId === user.id) {
      return false;
    }
    
    const empName = r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : "";
    const typeName = r.type?.name || "";
    return empName.toLowerCase().includes(search.toLowerCase()) ||
      typeName.toLowerCase().includes(search.toLowerCase()) ||
      r.status.toLowerCase().includes(search.toLowerCase());
  });

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="timeOffApprovals" moduleName="Time Off Approvals" />

      {/* Navigation Sub-bar */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
        <button
          onClick={() => navigate("/time-off/requests")}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          Leave Requests
        </button>
        {isAdminOrHR && (
          <button
            onClick={() => navigate("/time-off/approvals")}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#5B8DEF] text-white"
          >
            Leave Approvals
          </button>
        )}
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
        title="Time Off Approvals"
        subtitle="Review and approve employee leave applications"
        searchQuery={search}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div className="text-white p-6">Loading requests...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No pending requests"
          description="There are currently no leave requests to approve."
        />
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Leave Type</th>
                <th className="py-3.5 px-4">Period Dates</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {filteredRequests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-white">
                    {req.employee ? `${req.employee.firstName} ${req.employee.lastName}` : "Unknown"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{req.type?.name || "—"}</td>
                  <td className="py-3.5 px-4 text-slate-400">{formatDate(req.startDate)} to {formatDate(req.endDate)}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">{Number(req.duration)} Days</td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate" title={req.reason || ""}>{req.reason || "—"}</td>
                  <td className="py-3.5 px-4"><StatusBadge status={req.status} /></td>
                  <td className="py-3.5 px-4 text-right">
                    {req.status === "PENDING" ? (
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
      )}
    </div>
  );
};

export default TimeOffApprovals;
