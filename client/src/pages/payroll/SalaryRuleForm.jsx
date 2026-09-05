import React from "react";
import { useParams } from "react-router-dom";
import { SALARY_RULES } from "../../data/payroll";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { Code, Info } from "lucide-react";

const SalaryRuleForm = () => {
  const { id } = useParams();
  const rule = SALARY_RULES.find((r) => r.id === id) || SALARY_RULES[0];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <MockRbacNotice moduleKey="salaryRules" moduleName={`Salary Rule (${rule.name})`} />

      <PageHeader
        title={`Salary Rule: ${rule.name}`}
        subtitle={`Code: ${rule.code} • Category: ${rule.category}`}
        showBack
        backPath="/payroll/rules"
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#1E293B]">
          <div className="w-12 h-12 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{rule.name}</h2>
            <p className="text-xs text-slate-400">Rule Category: <span className="text-emerald-400 font-mono font-semibold">{rule.category}</span></p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Rule Code</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-[#5B8DEF] font-mono font-bold">
                {rule.code}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Execution Sequence</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white font-mono">
                {rule.sequence}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Formula Expression</label>
            <div className="mt-1 p-3 bg-[#020817] border border-[#1E293B] rounded-lg font-mono text-emerald-400 font-bold text-sm">
              {rule.formula}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/20 text-slate-300 text-xs flex items-center gap-3">
          <Info className="w-5 h-5 text-[#5B8DEF] shrink-0" />
          <p>
            <strong className="text-white">Business Rule Note:</strong> Salary Rules generate line items on the payslip based on their sequence and category.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalaryRuleForm;
