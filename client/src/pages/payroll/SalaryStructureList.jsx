import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePayroll } from "../../hooks/usePayroll";
import { canEditModule } from "../../utils/rolePermissions";
import PageHeader from "../../components/shared/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import { Layers, Plus, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

const SalaryStructureList = () => {
  const { salaryStructures, loading, error, addStructure } = usePayroll();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreateStructure = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Structure name is required");
      return;
    }
    const res = await addStructure({ name });
    if (res.success) {
      toast.success("Salary structure created");
      setName("");
      setIsModalOpen(false);
    } else {
      toast.error(res.error || "Failed to create structure");
    }
  };

  const filteredStructures = salaryStructures.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="salaryStructures" moduleName="Salary Structures" />

      {/* Payroll Sub-navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3 overflow-x-auto">
        <button onClick={() => navigate("/payroll/payruns")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50">
          Payruns
        </button>
        <button onClick={() => navigate("/payroll/payslips")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50">
          Payslips
        </button>
        <button onClick={() => navigate("/payroll/structures")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#5B8DEF] text-white">
          Salary Structures
        </button>
        <button onClick={() => navigate("/payroll/rules")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50">
          Salary Rules
        </button>
      </div>

      <PageHeader
        title="Salary Structures"
        subtitle="Manage structure templates defining salary allowances and tax deduction rules"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel={canEditModule(user?.role, "salaryStructures") ? "New Structure" : undefined}
        onActionClick={canEditModule(user?.role, "salaryStructures") ? () => setIsModalOpen(true) : undefined}
      />

      {loading ? (
        <div className="text-white p-6">Loading salary structures...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredStructures.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No salary structures found"
          description="Create a salary structure template."
          actionLabel={canEditModule(user?.role, "salaryStructures") ? "Create Structure" : undefined}
          onAction={canEditModule(user?.role, "salaryStructures") ? () => setIsModalOpen(true) : undefined}
        />
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4">Structure Name</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Linked Rules</th>
                <th className="py-3.5 px-4">Linked Contracts</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {filteredStructures.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/payroll/structures/${s.id}`)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-white text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${s.active ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30" : "text-slate-500 bg-slate-800 border border-slate-700"}`}>
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">{s._count?.rules || s.rules?.length || 0} Rules</td>
                  <td className="py-3.5 px-4 text-slate-400">{s._count?.contracts || 0} Contracts</td>
                  <td className="py-3.5 px-4 text-right text-[#5B8DEF] font-medium">View →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Salary Structure Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-lg font-bold text-white">Create Salary Structure</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStructure} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Structure Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Time Employee Structure"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
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
                  <span>Create Structure</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryStructureList;
