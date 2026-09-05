import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../../hooks/useEmployees";
import PageHeader from "../../components/shared/PageHeader";
import StatusBadge from "../../components/shared/StatusBadge";
import EmptyState from "../../components/shared/EmptyState";
import { Mail, Building2, Briefcase, User } from "lucide-react";

const EmployeesKanban = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { employees, loading, error } = useEmployees();

  const [showInactive, setShowInactive] = useState(false);

  const filteredEmployees = employees.filter(
    (emp) => {
      const matchesSearch = emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
        emp.department?.name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.jobPosition?.title?.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = showInactive || emp.status !== 'TERMINATED';
      return matchesSearch && matchesStatus;
    }
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Employees Directory"
        subtitle="Workforce management & organogram profiles"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="New Employee"
        onActionClick={() => navigate("/employees/new")}
        viewMode="kanban"
        onViewModeChange={(mode) => {
          if (mode === "list") navigate("/employees/list");
        }}
      >
        <div className="flex items-center gap-2 mr-2 border-r border-[#1E293B] pr-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
            <input 
              type="checkbox" 
              checked={showInactive} 
              onChange={(e) => setShowInactive(e.target.checked)} 
              className="rounded bg-[#020817] border-[#1E293B] text-[#5B8DEF] focus:ring-[#5B8DEF]"
            />
            Show Inactive
          </label>
        </div>
      </PageHeader>

      {loading ? (
        <div className="text-white p-6">Loading employees...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredEmployees.length === 0 ? (
        <EmptyState
          title="No employees found"
          description="No employee records match your search filter."
          actionLabel="Create Employee"
          onAction={() => navigate("/employees/new")}
        />
      ) : (
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
                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-[#5B8DEF] transition-colors leading-tight">
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <p className="text-xs text-[#5B8DEF] font-mono mt-0.5">{emp.employeeCode}</p>
                  </div>
                </div>
                <StatusBadge status={emp.status} />
              </div>

              <div className="space-y-2 text-xs text-slate-400 border-t border-[#1E293B] pt-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate text-slate-300 font-medium">{emp.jobPosition?.title || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{emp.department?.name || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Manager: {emp.manager ? `${emp.manager.firstName} ${emp.manager.lastName}` : "None"}</span>
                <span className="text-[#5B8DEF] font-medium group-hover:translate-x-0.5 transition-transform">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeesKanban;
