import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PAYRUNS } from "../../data/payroll";
import { canAccessModule } from "../../utils/rolePermissions";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { CircleDollarSign } from "lucide-react";

const PayrunList = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || "EMPLOYEE";

  const filteredPayruns = PAYRUNS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.structureName.toLowerCase().includes(search.toLowerCase()) ||
    p.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="payruns" moduleName="Payroll Payruns" />

      {/* Role-Filtered Sub-navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3 overflow-x-auto">
        {canAccessModule(role, "payruns") && (
          <button onClick={() => navigate("/payroll/payruns")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#5B8DEF] text-white">
            Payruns
          </button>
        )}
        {canAccessModule(role, "payslips") && (
          <button onClick={() => navigate("/payroll/payslips")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50">
            Payslips
          </button>
        )}
        {canAccessModule(role, "salaryStructures") && (
          <button onClick={() => navigate("/payroll/structures")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50">
            Salary Structures
          </button>
        )}
        {canAccessModule(role, "salaryRules") && (
          <button onClick={() => navigate("/payroll/rules")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50">
            Salary Rules
          </button>
        )}
      </div>

      <PageHeader
        title="Payrun Batch Management"
        subtitle="Process monthly salary batches, compute payslips, and dispatch salary disbursements"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel={canAccessModule(role, "payruns") ? "Create Payrun" : null}
        onActionClick={() => navigate("/payroll/payruns/new")}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Payrun Batch Name</th>
              <th className="py-3.5 px-4">Salary Structure</th>
              <th className="py-3.5 px-4">Period</th>
              <th className="py-3.5 px-4">Employees</th>
              <th className="py-3.5 px-4">Total Net Salary</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {filteredPayruns.map((pr) => (
              <tr
                key={pr.id}
                onClick={() => navigate(`/payroll/payruns/${pr.id}`)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
                      <CircleDollarSign className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-sm">{pr.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-300">{pr.structureName}</td>
                <td className="py-3.5 px-4 text-slate-400">{pr.period}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-200">{pr.employeesCount} Employees</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">₹{pr.totalNet.toLocaleString()}</td>
                <td className="py-3.5 px-4"><StatusBadge status={pr.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrunList;
