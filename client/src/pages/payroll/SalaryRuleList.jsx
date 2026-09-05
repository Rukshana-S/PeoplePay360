import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePayroll } from "../../hooks/usePayroll";
import PageHeader from "../../components/shared/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import { Code, Plus, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

const SalaryRuleList = () => {
  const { salaryStructures, salaryRules, loading, error, addRule } = usePayroll();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [structureId, setStructureId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("ALW");
  const [sequence, setSequence] = useState(1);
  const [formula, setFormula] = useState("");
  const navigate = useNavigate();

  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!structureId) {
      toast.error("Target structure is required");
      return;
    }
    const res = await addRule({
      structureId,
      name,
      code,
      category,
      sequence: Number(sequence),
      formula,
    });
    if (res.success) {
      toast.success("Salary rule created");
      setName("");
      setCode("");
      setFormula("");
      setIsModalOpen(false);
    } else {
      toast.error(res.error || "Failed to create rule");
    }
  };

  const filteredRules = salaryRules.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.code.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="salaryRules" moduleName="Salary Rules" />

      {/* Payroll Sub-navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3 overflow-x-auto">
        <button onClick={() => navigate("/payroll/payruns")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50">
          Payruns
        </button>
        <button onClick={() => navigate("/payroll/payslips")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50">
          Payslips
        </button>
        <button onClick={() => navigate("/payroll/structures")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50">
          Salary Structures
        </button>
        <button onClick={() => navigate("/payroll/rules")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#5B8DEF] text-white">
          Salary Rules
        </button>
      </div>

      <PageHeader
        title="Salary Rules"
        subtitle="Individual computation formulas for allowances, tax deductions, and net salary lines"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="New Salary Rule"
        onActionClick={() => setIsModalOpen(true)}
      />

      {loading ? (
        <div className="text-white p-6">Loading rules...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredRules.length === 0 ? (
        <EmptyState
          icon={Code}
          title="No salary rules found"
          description="Define salary calculation rules."
          actionLabel="Create Salary Rule"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4">Rule Name</th>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Structure</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Formula Definition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {filteredRules.map((rule) => (
                <tr
                  key={rule.id}
                  onClick={() => navigate(`/payroll/rules/${rule.id}`)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-white">{rule.name}</td>
                  <td className="py-3.5 px-4 font-mono text-[#5B8DEF] font-semibold">{rule.code}</td>
                  <td className="py-3.5 px-4 text-slate-300">{rule.salaryStructure?.name || "—"}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {rule.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">{rule.formula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Salary Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-lg font-bold text-white">Create Salary Rule</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Target Structure</label>
                <select
                  required
                  value={structureId}
                  onChange={(e) => setStructureId(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                >
                  <option value="">Select Structure</option>
                  {salaryStructures.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Travel Allowance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Rule Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TA"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white font-mono uppercase focus:border-[#5B8DEF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                  >
                    <option value="BASIC">BASIC</option>
                    <option value="ALW">Allowance (ALW)</option>
                    <option value="DED">Deduction (DED)</option>
                    <option value="GROSS">GROSS</option>
                    <option value="NET">NET</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Sequence *</label>
                <input
                  type="number"
                  required
                  value={sequence}
                  onChange={(e) => setSequence(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Formula Expression *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BASIC * 0.10"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-emerald-400 font-mono focus:border-[#5B8DEF] focus:outline-none"
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
                  <span>Create Salary Rule</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryRuleList;
