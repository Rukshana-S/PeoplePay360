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

const TimeOffRequests = () => {
  const { requests, leaveTypes, loading, error, addRequest, reviewRequest } = useTimeOff();
  const { employees } = useEmployees();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
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

  const handleCreateRequestSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || !typeId) {
      toast.error("Employee and Leave Type are required");
      return;
    }
    const res = await addRequest({
      employeeId,
      typeId,
      startDate,
      endDate,
    });
    if (res.success) {
      toast.success("Leave request submitted");
      setIsModalOpen(false);
    } else {
      toast.error(res.error || "Failed to submit request");
    }
  };

  const filteredRequests = requests.filter((r) => {
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
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Employee *</label>
                <select
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>

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
