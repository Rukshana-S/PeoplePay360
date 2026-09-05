import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { FileText, Info, DollarSign, Calendar, Building2, User, Clock, Layers } from "lucide-react";
import * as api from "../../api/contracts";
import { toast } from "react-toastify";

const ContractForm = () => {
  const { id } = useParams();
  
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await api.getContractById(id);
        setContract(res.data || res);
      } catch (err) {
        toast.error("Failed to load contract details");
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [id]);

  if (loading) return <div className="text-white p-6">Loading contract details...</div>;
  if (!contract) return <div className="text-white p-6">Contract not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <MockRbacNotice moduleKey="contracts" moduleName={`Contract Details (${contract.id.substring(0, 8).toUpperCase()})`} />

      <PageHeader
        title={`Contract: ${contract.id.substring(0, 8).toUpperCase()}`}
        subtitle={`Employment Agreement • ${contract.employee?.firstName} ${contract.employee?.lastName}`}
        showBack
        backPath="/contracts"
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        {/* Header summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{contract.id.substring(0, 8).toUpperCase()}</h2>
              <p className="text-xs text-slate-400">Assigned to <span className="text-slate-200 font-semibold">{contract.employee?.firstName} {contract.employee?.lastName}</span></p>
            </div>
          </div>
          <StatusBadge status={contract.status} />
        </div>

        {/* Contract fields grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Employee</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#5B8DEF]" />
                <span className="font-semibold">{contract.employee?.firstName} {contract.employee?.lastName}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Department</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>{contract.department?.name || "-"}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Working Schedule</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{contract.schedule?.name || "None"}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Contract Validity</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{new Date(contract.startDate).toLocaleDateString()} to {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "Indefinite"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Salary Structure</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span className="font-medium">{contract.salaryStructure?.name || "-"}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Annual Contract Wage</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-emerald-400 flex items-center gap-2 font-bold text-base">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>₹{Number(contract.wage).toLocaleString()} / year</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Job Position</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white">
                <span>{contract.jobPosition?.title || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Required Business Rule Note */}
        <div className="mt-6 p-4 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/20 text-slate-300 text-xs flex items-center gap-3">
          <Info className="w-5 h-5 text-[#5B8DEF] shrink-0" />
          <p>
            <strong className="text-white">Business Rule Note:</strong> Payroll always uses the <span className="text-emerald-400 font-semibold">ACTIVE</span> contract for the selected payroll period.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractForm;
