import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SALARY_RULES } from "../../data/payroll";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { toast } from "react-toastify";

const SalaryRuleList = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredRules = SALARY_RULES.filter((r) =>
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
        onActionClick={() => toast.info("New Salary Rule editor dialog ready.")}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Rule Name</th>
              <th className="py-3.5 px-4">Code</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Sequence</th>
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
                <td className="py-3.5 px-4 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {rule.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400">{rule.sequence}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">{rule.formula}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryRuleList;
