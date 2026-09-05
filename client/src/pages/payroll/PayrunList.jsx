import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePayroll } from "../../hooks/usePayroll";
import { canAccessModule } from "../../utils/rolePermissions";
import PageHeader from "../../components/shared/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import { CircleDollarSign } from "lucide-react";

const PayrunList = () => {
  const { payruns, loading, error } = usePayroll();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || "EMPLOYEE";

  const filteredPayruns = payruns.filter((p) => {
    const structName = p.salaryStructure?.name || "";
    return structName.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase());
  });

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

      {loading ? (
        <div className="text-white p-6">Loading payruns...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredPayruns.length === 0 ? (
        <EmptyState
          icon={CircleDollarSign}
          title="No payruns found"
          description="Create a new payrun to generate payslips."
          actionLabel="Create Payrun"
          onAction={() => navigate("/payroll/payruns/new")}
        />
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4">Payrun Batch Name</th>
                <th className="py-3.5 px-4">Salary Structure</th>
                <th className="py-3.5 px-4">Period</th>
                <th className="py-3.5 px-4">Employees</th>
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
                      <span className="font-bold text-white text-sm">Payrun #{pr.id.slice(-4)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{pr.salaryStructure?.name || "—"}</td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(pr.periodStart).toLocaleDateString()} - {new Date(pr.periodEnd).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{pr._count?.payslips || 0} Employees</td>
                  <td className="py-3.5 px-4"><StatusBadge status={pr.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PayrunList;
