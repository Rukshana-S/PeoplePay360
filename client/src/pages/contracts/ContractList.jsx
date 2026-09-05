import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONTRACTS } from "../../data/contracts";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { toast } from "react-toastify";

const ContractList = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredContracts = CONTRACTS.filter((c) =>
    c.contractNo.toLowerCase().includes(search.toLowerCase()) ||
    c.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    c.salaryStructure.toLowerCase().includes(search.toLowerCase()) ||
    c.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="contracts" moduleName="Contracts Registry" />

      <PageHeader
        title="Contracts"
        subtitle="Manage employment agreements, terms, and salary structures"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="New Contract"
        onActionClick={() => toast.info("New Contract form ready. Click any row to view details.")}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4">Contract No</th>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Salary Structure</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4">End Date</th>
                <th className="py-3.5 px-4">Annual Wage</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {filteredContracts.map((cnt) => (
                <tr
                  key={cnt.id}
                  onClick={() => navigate(`/contracts/${cnt.id}`)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#5B8DEF]">{cnt.contractNo}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">{cnt.employeeName}</td>
                  <td className="py-3.5 px-4 text-slate-300">{cnt.salaryStructure}</td>
                  <td className="py-3.5 px-4 text-slate-400">{cnt.startDate}</td>
                  <td className="py-3.5 px-4 text-slate-400">{cnt.endDate}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">₹{cnt.wage.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={cnt.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContractList;
