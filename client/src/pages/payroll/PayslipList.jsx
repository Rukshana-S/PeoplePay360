import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePayroll } from "../../hooks/usePayroll";
import { canAccessModule } from "../../utils/rolePermissions";
import PageHeader from "../../components/shared/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import { FileText } from "lucide-react";

const PayslipList = () => {
  const { payslips, loading, error } = usePayroll();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || "EMPLOYEE";

  const filteredPayslips = payslips.filter((ps) => {
    const empName = ps.employee ? `${ps.employee.firstName} ${ps.employee.lastName}` : "";
    const structName = ps.payrun?.salaryStructure?.name || "";
    return empName.toLowerCase().includes(search.toLowerCase()) ||
      structName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="payslips" moduleName="Employee Payslips" />

      {/* Role-Filtered Sub-navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3 overflow-x-auto">
        {canAccessModule(role, "payruns") && (
          <button onClick={() => navigate("/payroll/payruns")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50">
            Payruns
          </button>
        )}
        {canAccessModule(role, "payslips") && (
          <button onClick={() => navigate("/payroll/payslips")} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#5B8DEF] text-white">
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
        title="Employee Payslips"
        subtitle="Individual salary computation records, allowances, and statutory tax breakdown"
        searchQuery={search}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div className="text-white p-6">Loading payslips...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredPayslips.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No payslips found"
          description="Process a payrun to generate payslips."
          actionLabel="Go to Payruns"
          onAction={() => navigate("/payroll/payruns")}
        />
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Period</th>
                <th className="py-3.5 px-4">Salary Structure</th>
                <th className="py-3.5 px-4">Gross Amount</th>
                <th className="py-3.5 px-4">Net Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {filteredPayslips.map((ps) => (
                <tr
                  key={ps.id}
                  onClick={() => navigate(`/payroll/payslips/${ps.id}`)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#5B8DEF]" />
                    <span>{ps.employee ? `${ps.employee.firstName} ${ps.employee.lastName}` : "Unknown"}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {ps.payrun ? `${new Date(ps.payrun.periodStart).toLocaleDateString()} - ${new Date(ps.payrun.periodEnd).toLocaleDateString()}` : "—"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{ps.payrun?.salaryStructure?.name || "—"}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">₹{Number(ps.grossSalary).toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">₹{Number(ps.netSalary).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PayslipList;
