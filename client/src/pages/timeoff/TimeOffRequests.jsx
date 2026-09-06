import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimeOff } from "../../hooks/useTimeOff";
import { useEmployees } from "../../hooks/useEmployees";
import PageHeader from "../../components/shared/PageHeader";
import StatusBadge from "../../components/shared/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import { Check, X, Clock, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const TimeOffRequests = () => {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';
  const { requests, leaveTypes, loading, error, addRequest } = useTimeOff();
  const { employees } = useEmployees();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const navigate = useNavigate();



  const handleCreateRequestSubmit = async (e) => {
    e.preventDefault();
    if (!typeId) {
      toast.error("Leave Type is required");
      return;
    }
    if (!reason.trim()) {
      toast.error("Reason is required");
      return;
    }
    const res = await addRequest({
      employeeId: user.employeeId || null,
      typeId,
      startDate,
      endDate,
      reason,
    });
    if (res.success) {
      toast.success("Leave request submitted");
      setIsModalOpen(false);
    } else {
      toast.error(res.error || "Failed to submit request");
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (r.employee?.userId !== user.id) return false;
    
    const empName = r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : "";
    const typeName = r.type?.name || "";
    return empName.toLowerCase().includes(search.toLowerCase()) ||
      typeName.toLowerCase().includes(search.toLowerCase()) ||
      r.status.toLowerCase().includes(search.toLowerCase());
  });

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

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
        {isAdminOrHR && (
          <button
            onClick={() => navigate("/time-off/approvals")}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50"
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
        title="My Time Off Requests"
        subtitle="Manage your vacation, sick leave, and casual leave applications"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="New Request"
        onActionClick={() => setIsModalOpen(true)}
      />

      {loading ? (
        <div className="text-white p-6">Loading requests...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No leave requests found"
          description="There are currently no leave requests submitted."
          actionLabel="Create Request"
          onAction={() => setIsModalOpen(true)}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Leave Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-lg font-bold text-white">Submit Leave Request</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequestSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Leave Type *</label>
                <select
                  required
                  value={typeId}
                  onChange={(e) => setTypeId(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map((lt) => (
                    <option key={lt.id} value={lt.id}>{lt.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Reason *</label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Required details..."
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none min-h-[80px] resize-y"
                />
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent border border-[#1E293B] text-slate-300 hover:bg-slate-800 px-4 h-9 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#5B8DEF] hover:bg-[#4a7ad8] text-white px-4 h-9 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Request</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeOffRequests;
