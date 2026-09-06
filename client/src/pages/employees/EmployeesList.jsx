import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../../hooks/useEmployees";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/shared/PageHeader";
import StatusBadge from "../../components/shared/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import ConfirmDeleteDialog from "../../components/shared/ConfirmDeleteDialog";
import { User, Trash2 } from "lucide-react";

const EmployeesList = () => {
  const { user } = useAuth();
  const isEmployee = user?.role === 'EMPLOYEE';
  const { employees, loading, error, removeEmployee } = useEmployees();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.department?.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.jobPosition?.title?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = emp.status !== 'TERMINATED' && emp.status !== 'INACTIVE';
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="employees" moduleName="Employees List" />

      <PageHeader
        title="Employees List"
        subtitle="Detailed tabular list of workforce records"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel={!isEmployee ? "New Employee" : undefined}
        onActionClick={!isEmployee ? () => navigate("/employees/new") : undefined}
        viewMode="list"
        onViewModeChange={(mode) => {
          if (mode === "kanban") navigate("/employees");
        }}
      />

      {loading ? (
        <div className="text-white p-6">Loading employees...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredEmployees.length === 0 ? (
        <EmptyState
          icon={User}
          title="No employees found"
          description="Try adjusting your search criteria or register a new employee."
          actionLabel="Create Employee"
          onAction={() => navigate("/employees/new")}
        />
      ) : (
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
                  {!isEmployee && <th className="py-3.5 px-4 text-right">Actions</th>}
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
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                        <span className="font-semibold text-white">{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{emp.email}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">{emp.jobPosition?.title || "-"}</td>
                    <td className="py-3.5 px-4 text-slate-400">{emp.department?.name || "-"}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={emp.status} />
                    </td>
                    {!isEmployee && (
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setDeleteId(emp.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteId && (() => {
        const empToDelete = employees.find(e => e.id === deleteId);
        return (
          <ConfirmDeleteDialog
            isOpen={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={async () => {
              await removeEmployee(deleteId);
              setDeleteId(null);
            }}
            title={`Delete ${empToDelete?.firstName} ${empToDelete?.lastName}?`}
            description="Warning: This employee will be archived."
          />
        );
      })()}
    </div>
  );
};

export default EmployeesList;
