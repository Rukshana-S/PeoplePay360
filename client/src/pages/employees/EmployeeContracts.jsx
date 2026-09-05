import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CONTRACTS } from "../../data/contracts";
import { EMPLOYEES } from "../../data/employees";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";

const EmployeeContracts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const employee = EMPLOYEES.find((e) => e.id === id) || EMPLOYEES[0];
  const employeeContracts = CONTRACTS.filter((c) => c.employeeId === employee.id || c.employeeName === employee.name);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <MockRbacNotice moduleKey="contracts" moduleName={`Contracts for ${employee.name}`} />

      <PageHeader
        title={`Contracts: ${employee.name}`}
        subtitle={`Employment contract records for ${employee.name} (${employee.employeeCode})`}
        showBack
        backPath={`/employees/${employee.id}`}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Contract No</th>
              <th className="py-3.5 px-4">Salary Structure</th>
              <th className="py-3.5 px-4">Annual Wage</th>
              <th className="py-3.5 px-4">Period</th>
              <th className="py-3.5 px-4">Schedule</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {employeeContracts.map((cnt) => (
              <tr
                key={cnt.id}
                onClick={() => navigate(`/contracts/${cnt.id}`)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-mono text-[#5B8DEF] font-bold">{cnt.contractNo}</td>
                <td className="py-3.5 px-4 font-medium text-white">{cnt.salaryStructure}</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-400">₹{cnt.wage.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-slate-400">{cnt.startDate} to {cnt.endDate}</td>
                <td className="py-3.5 px-4 text-slate-400">{cnt.workingSchedule}</td>
                <td className="py-3.5 px-4"><StatusBadge status={cnt.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeContracts;
