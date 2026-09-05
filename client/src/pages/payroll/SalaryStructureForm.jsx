import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../../api/payroll";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { Layers, Info } from "lucide-react";
import { toast } from "react-toastify";

const SalaryStructureForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [structure, setStructure] = useState(null);
  const [mappedRules, setMappedRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [structRes, rulesRes] = await Promise.all([
          api.getSalaryStructureById(id),
          api.getSalaryRules({ structureId: id })
        ]);
        setStructure(structRes.data || structRes);
        setMappedRules(rulesRes.data || rulesRes || []);
      } catch (err) {
        toast.error("Failed to fetch salary structure");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-6 text-white">Loading salary structure...</div>;
  if (!structure) return <div className="p-6 text-rose-400">Salary structure not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <MockRbacNotice moduleKey="salaryStructures" moduleName={`Salary Structure (${structure.name})`} />

      <PageHeader
        title={`Salary Structure: ${structure.name}`}
        subtitle={`Code: ${structure.code} • Target: ${structure.type}`}
        showBack
        backPath="/payroll/structures"
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{structure.name}</h2>
              <p className="text-xs text-slate-400">{structure.description}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
            {mappedRules.length} Active Rules
          </span>
        </div>

        {/* Rules Table */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3">Associated Salary Rules Sequence</h3>
          <div className="border border-[#1E293B] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
                <tr>
                  <th className="py-3 px-4">Seq</th>
                  <th className="py-3 px-4">Rule Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Formula</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60">
                {mappedRules.map((rule) => (
                  <tr
                    key={rule.id}
                    onClick={() => navigate(`/payroll/rules/${rule.id}`)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#5B8DEF]">{rule.sequence}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{rule.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{rule.code}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {rule.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">{rule.formula}</td>
                  </tr>
                ))}
                {mappedRules.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-4 px-4 text-center text-slate-400">No rules associated with this structure yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/20 text-slate-300 text-xs flex items-center gap-3">
          <Info className="w-5 h-5 text-[#5B8DEF] shrink-0" />
          <p>
            <strong className="text-white">Business Rule Note:</strong> Rules are executed sequentially in numerical order during payslip computation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalaryStructureForm;
