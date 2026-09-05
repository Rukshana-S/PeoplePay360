import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EMPLOYEES } from "../../data/employees";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { toast } from "react-toastify";

const EmployeesList = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredEmployees = EMPLOYEES.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase()) ||
    emp.jobPosition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="employees" moduleName="Employees List" />

      <PageHeader
        title="Employees List"
        subtitle="Detailed tabular list of workforce records"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="New Employee"
        onActionClick={() => toast.info("New Employee form ready.")}
        viewMode="list"
        onViewModeChange={(mode) => {
          if (mode === "kanban") navigate("/employees");
        }}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Work Email</th>
                <th className="py-3.5 px-4">Job Position</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono text-[#5B8DEF] font-medium">{emp.employeeCode}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                        {emp.avatar}
                      </div>
                      <span className="font-semibold text-white">{emp.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{emp.email}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">{emp.jobPosition}</td>
                  <td className="py-3.5 px-4 text-slate-400">{emp.department}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={emp.status} />
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

export default EmployeesList;
