import React from "react";
import { useParams } from "react-router-dom";
import { CONTRACTS } from "../../data/contracts";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { FileText, Info, DollarSign, Calendar, Building2, User, Clock, Layers } from "lucide-react";

const ContractForm = () => {
  const { id } = useParams();
  const contract = CONTRACTS.find((c) => c.id === id) || CONTRACTS[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <MockRbacNotice moduleKey="contracts" moduleName={`Contract Details (${contract.contractNo})`} />

      <PageHeader
        title={`Contract: ${contract.contractNo}`}
        subtitle={`Employment Agreement • ${contract.employeeName}`}
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
              <h2 className="text-xl font-bold text-white tracking-tight">{contract.contractNo}</h2>
              <p className="text-xs text-slate-400">Assigned to <span className="text-slate-200 font-semibold">{contract.employeeName}</span></p>
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
                <span className="font-semibold">{contract.employeeName}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Department</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>{contract.department}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Working Schedule</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{contract.workingSchedule}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Contract Validity</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{contract.startDate} to {contract.endDate}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Salary Structure</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span className="font-medium">{contract.salaryStructure}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Annual Contract Wage</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-emerald-400 flex items-center gap-2 font-bold text-base">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>₹{contract.wage.toLocaleString()} / year</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Job Position</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white">
                <span>{contract.jobPosition}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Internal Notes</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-xs text-slate-300">
                <span>{contract.note || "No custom contract notes."}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Required Business Rule Note */}
        <div className="mt-6 p-4 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/20 text-slate-300 text-xs flex items-center gap-3">
          <Info className="w-5 h-5 text-[#5B8DEF] shrink-0" />
          <p>
            <strong className="text-white">Business Rule Note:</strong> Payroll always uses the <span className="text-emerald-400 font-semibold">Running</span> contract for the selected payroll period.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractForm;
