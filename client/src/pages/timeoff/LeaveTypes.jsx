import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimeOff } from "../../hooks/useTimeOff";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import { Check, X, Layers, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

const LeaveTypes = () => {
  const { leaveTypes, loading, error, addLeaveType } = useTimeOff();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("DAYS");
  const [payrollAffects, setPayrollAffects] = useState(true);
  const navigate = useNavigate();

  const handleCreateLeaveType = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Leave type name is required");
      return;
    }
    const res = await addLeaveType({ name, unit, payrollAffects });
    if (res.success) {
      toast.success("Leave type created");
      setName("");
      setIsModalOpen(false);
    } else {
      toast.error(res.error || "Failed to create leave type");
    }
  };

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
        subtitle="Configure leave rules, tracking units, and payroll impact"
        actionLabel="New Leave Type"
        onActionClick={() => setIsModalOpen(true)}
      />

      {loading ? (
        <div className="text-white p-6">Loading leave types...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : leaveTypes.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No leave types configured"
          description="Define leave categories for your organization."
          actionLabel="Create Leave Type"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4">Leave Type Name</th>
                <th className="py-3.5 px-4">Tracking Unit</th>
                <th className="py-3.5 px-4">Payroll Affects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {leaveTypes.map((lt) => (
                <tr key={lt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{lt.name}</td>
                  <td className="py-3.5 px-4 text-slate-300">{lt.unit}</td>
                  <td className="py-3.5 px-4">
                    {lt.payrollAffects ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Paid</span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1"><X className="w-3.5 h-3.5" /> Unpaid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Leave Type Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-lg font-bold text-white">Create Leave Type</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLeaveType} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Leave Type Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parental Leave"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tracking Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                  >
                    <option value="DAYS">Days</option>
                    <option value="HOURS">Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Payroll Impact</label>
                  <select
                    value={payrollAffects ? "true" : "false"}
                    onChange={(e) => setPayrollAffects(e.target.value === "true")}
                    className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                  >
                    <option value="true">Paid</option>
                    <option value="false">Unpaid</option>
                  </select>
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
                  <span>Create Leave Type</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTypes;
