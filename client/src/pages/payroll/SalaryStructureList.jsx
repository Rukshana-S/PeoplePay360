import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SALARY_STRUCTURES } from "../../data/payroll";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { Layers } from "lucide-react";
import { toast } from "react-toastify";

const SalaryStructureList = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredStructures = SALARY_STRUCTURES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
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
        actionLabel="New Structure"
        onActionClick={() => toast.info("New Salary Structure template dialog ready.")}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Structure Name</th>
              <th className="py-3.5 px-4">Code</th>
              <th className="py-3.5 px-4">Employee Type</th>
              <th className="py-3.5 px-4">Mapped Rules</th>
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
                <td className="py-3.5 px-4 font-mono text-slate-400">{s.code}</td>
                <td className="py-3.5 px-4 text-slate-300">{s.type}</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-400">{s.rulesCount} Rules</td>
                <td className="py-3.5 px-4 text-right text-[#5B8DEF] font-medium">View Rules →</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryStructureList;
