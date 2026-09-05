import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EMPLOYEES } from "../../data/employees";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { Mail, Phone, Building2, Briefcase, User } from "lucide-react";
import { toast } from "react-toastify";

const EmployeesKanban = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredEmployees = EMPLOYEES.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase()) ||
    emp.jobPosition.toLowerCase().includes(search.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="employees" moduleName="Employees Directory" />

      <PageHeader
        title="Employees"
        subtitle="Employee directory & organogram management"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="New Employee"
        onActionClick={() => toast.info("New Employee form ready. Click any employee card to view details.")}
        viewMode="kanban"
        onViewModeChange={(mode) => {
          if (mode === "list") navigate("/employees/list");
        }}
      />

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            onClick={() => navigate(`/employees/${emp.id}`)}
            className="bg-[#0F172A] border border-[#1E293B] hover:border-[#5B8DEF]/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-[#5B8DEF]/5 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B8DEF]/20 to-indigo-600/20 border border-[#5B8DEF]/30 flex items-center justify-center font-bold text-white text-base uppercase shadow-sm">
                  {emp.avatar || <User className="w-6 h-6 text-slate-300" />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-[#5B8DEF] transition-colors leading-tight">
                    {emp.name}
                  </h3>
                  <p className="text-xs text-[#5B8DEF] font-mono mt-0.5">{emp.employeeCode}</p>
                </div>
              </div>
              <StatusBadge status={emp.status} />
            </div>

            <div className="space-y-2 text-xs text-slate-400 border-t border-[#1E293B] pt-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate text-slate-300 font-medium">{emp.jobPosition}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{emp.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{emp.email}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Manager: {emp.manager}</span>
              <span className="text-[#5B8DEF] font-medium group-hover:translate-x-0.5 transition-transform">
                View Profile →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesKanban;
