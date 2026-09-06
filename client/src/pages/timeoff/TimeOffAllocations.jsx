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
import { useAuth } from "../../context/AuthContext";

const TimeOffAllocations = () => {
  const { user } = useAuth();
  const isEmployee = user?.role === 'EMPLOYEE';
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';
  const { allocations, leaveTypes, loading, error, addAllocation } = useTimeOff();
  const { employees } = useEmployees();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [allocated, setAllocated] = useState("");
  const [validFrom, setValidFrom] = useState(new Date().getFullYear() + "-01-01");
  const [validUntil, setValidUntil] = useState(new Date().getFullYear() + "-12-31");
  const navigate = useNavigate();

  const filteredAllocations = allocations.filter((a) => {
    // Employees only see their own. HR/Admin see what the backend returned (which is scoped)
    if (isEmployee && a.employee?.userId !== user.id) return false;

    const empName = a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : "";
    const empCode = a.employee?.employeeCode || "";
    const typeName = a.type?.name || "";
    const s = search.toLowerCase();
    
    return empName.toLowerCase().includes(s) ||
      empCode.toLowerCase().includes(s) ||
      typeName.toLowerCase().includes(s);
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
      toast.success("Leave allocation saved");
      setIsModalOpen(false);
      resetForm();
    } else {
      toast.error(res.error || "Failed to save allocation");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this allocation?")) return;
    const res = await removeAllocation(id);
    if (res.success) {
      toast.success("Allocation deleted");
    } else {
      toast.error(res.error || "Failed to delete allocation");
    }
  };

  const handleEdit = (alloc) => {
    setEmployeeId(alloc.employeeId);
    setTypeId(alloc.typeId);
    setAllocated(alloc.allocated);
    setValidFrom(new Date(alloc.validFrom).toISOString().split('T')[0]);
    setValidUntil(new Date(alloc.validUntil).toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEmployeeId("");
    setTypeId("");
    setAllocated("");
    setValidFrom(new Date().getFullYear() + "-01-01");
    setValidUntil(new Date().getFullYear() + "-12-31");
  };

  const openNewModal = () => {
    resetForm();
    setIsModalOpen(true);
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
        actionLabel={!isEmployee ? "Allocate Leave" : undefined}
        onActionClick={!isEmployee ? openNewModal : undefined}
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
          actionLabel={!isEmployee ? "Allocate Leave" : undefined}
          onAction={!isEmployee ? openNewModal : undefined}
        />
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                {!isEmployee && <th className="py-3.5 px-4 font-semibold text-slate-300">Employee</th>}
                <th className="py-3.5 px-4 font-semibold text-slate-300">Type</th>
                <th className="py-3.5 px-4 font-semibold text-slate-300">Allocated</th>
                <th className="py-3.5 px-4 font-semibold text-slate-300">Taken</th>
                <th className="py-3.5 px-4 font-semibold text-slate-300">Remaining</th>
                <th className="py-3.5 px-4 font-semibold text-slate-300">Status</th>
                {!isEmployee && <th className="py-3.5 px-4 font-semibold text-slate-300 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {filteredAllocations.map((alloc) => {
                const used = Number(alloc.allocated) - Number(alloc.remaining);
                const year = new Date(alloc.validFrom).getFullYear();
                
                return (
                  <tr key={alloc.id} className="hover:bg-slate-800/40 transition-colors border-b border-[#1E293B]/60">
                    {!isEmployee && (
                      <td className="py-4 px-4 text-slate-200">
                        {alloc.employee ? `${alloc.employee.firstName} ${alloc.employee.lastName}` : "Unknown"}
                      </td>
                    )}
                    <td className="py-4 px-4 text-slate-200">{alloc.type?.name || "—"}</td>
                    <td className="py-4 px-4 text-slate-200">{Number(alloc.allocated)} days</td>
                    <td className="py-4 px-4 text-slate-200">{used} days</td>
                    <td className="py-4 px-4 text-slate-200">{Number(alloc.remaining)} days</td>
                    <td className="py-4 px-4">
                      <span className="text-emerald-500 font-medium tracking-wide">
                        Approved
                      </span>
                    </td>
                    {!isEmployee && (
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(alloc)} className="text-xs text-blue-400 hover:text-blue-300 font-medium">Edit</button>
                          <button onClick={() => handleDelete(alloc.id)} className="text-xs text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
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
