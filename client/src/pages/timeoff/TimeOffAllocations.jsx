import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimeOff } from "../../hooks/useTimeOff";
import { useEmployees } from "../../hooks/useEmployees";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import { CalendarCheck, Plus, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

const TimeOffAllocations = () => {
  const { allocations, leaveTypes, loading, error, addAllocation } = useTimeOff();
  const { employees } = useEmployees();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [allocated, setAllocated] = useState(15);
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split("T")[0]);
  const [validUntil, setValidUntil] = useState(new Date(new Date().getFullYear(), 11, 31).toISOString().split("T")[0]);
  const navigate = useNavigate();

  const filteredAllocations = allocations.filter((a) => {
    const empName = a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : "";
    const typeName = a.type?.name || "";
    return empName.toLowerCase().includes(search.toLowerCase()) ||
      typeName.toLowerCase().includes(search.toLowerCase());
  });

  const handleCreateAllocation = async (e) => {
    e.preventDefault();
    if (!employeeId || !typeId) {
      toast.error("Employee and Leave Type are required");
      return;
    }
    const res = await addAllocation({
      employeeId,
      typeId,
      allocated: Number(allocated),
      remaining: Number(allocated),
      validFrom,
      validUntil,
    });
    if (res.success) {
      toast.success("Leave allocation created");
      setIsModalOpen(false);
    } else {
      toast.error(res.error || "Failed to create allocation");
    }
  };

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
        onActionClick={() => setIsModalOpen(true)}
      />

      {loading ? (
        <div className="text-white p-6">Loading allocations...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredAllocations.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No allocations found"
          description="Allocate annual leave quotas to employees."
          actionLabel="Allocate Leave"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Leave Type</th>
                <th className="py-3.5 px-4">Total Allocated</th>
                <th className="py-3.5 px-4">Remaining Balance</th>
                <th className="py-3.5 px-4">Valid Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {filteredAllocations.map((alloc) => (
                <tr key={alloc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {alloc.employee ? `${alloc.employee.firstName} ${alloc.employee.lastName}` : "Unknown"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{alloc.type?.name || "—"}</td>
                  <td className="py-3.5 px-4 text-slate-400">{Number(alloc.allocated)} Days</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">{Number(alloc.remaining)} Days</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {new Date(alloc.validFrom).toLocaleDateString()} – {new Date(alloc.validUntil).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Allocate Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-lg font-bold text-white">Allocate Leave Quota</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAllocation} className="space-y-4">
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

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Number of Days Allocated *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="365"
                  value={allocated}
                  onChange={(e) => setAllocated(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Valid From</label>
                  <input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
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
                  <span>Allocate Quota</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeOffAllocations;
