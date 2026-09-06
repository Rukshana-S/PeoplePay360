import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContracts } from "../../hooks/useContracts";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import { FileText, Trash2, Edit } from "lucide-react";
import ConfirmDeleteDialog from "../../components/shared/ConfirmDeleteDialog";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const ContractList = () => {
  const { user } = useAuth();
  const canManageContracts = ['HR_MANAGER', 'HR_PAYROLL_MANAGER', 'ADMIN'].includes(user?.role);
  const { contracts, loading, error, removeContract } = useContracts();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const filteredContracts = contracts.filter((c) => {
    const empName = `${c.employee?.firstName} ${c.employee?.lastName}`.toLowerCase();
    const structName = c.salaryStructure?.name?.toLowerCase() || "";
    const contractId = c.id.toLowerCase();
    const status = c.status.toLowerCase();
    const q = search.toLowerCase();
    
    return empName.includes(q) || structName.includes(q) || contractId.includes(q) || status.includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="contracts" moduleName="Contracts Registry" />

      <PageHeader
        title="Contracts"
        subtitle="Manage employment agreements, terms, and salary structures"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel={canManageContracts ? "New Contract" : undefined}
        onActionClick={canManageContracts ? () => navigate("/contracts/new") : undefined}
      />

      {loading ? (
        <div className="text-white p-6">Loading contracts...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredContracts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No contracts found"
          title="No contracts found"
          description="Try adjusting your search criteria or create a new contract agreement."
          actionLabel={canManageContracts ? "Create Contract" : undefined}
          onAction={canManageContracts ? () => navigate("/contracts/new") : undefined}
        />
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
                <tr>
                  <th className="py-3.5 px-4">Contract ID</th>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Salary Structure</th>
                  <th className="py-3.5 px-4">Start Date</th>
                  <th className="py-3.5 px-4">End Date</th>
                  <th className="py-3.5 px-4">Annual Wage</th>
                  <th className="py-3.5 px-4">Status</th>
                  {canManageContracts && <th className="py-3.5 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60">
                {filteredContracts.map((cnt) => (
                  <tr
                    key={cnt.id}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    onClick={() => navigate(`/contracts/${cnt.id}`)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#5B8DEF]">CNT-{cnt.id.substring(0, 8).toUpperCase()}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{cnt.employee?.firstName} {cnt.employee?.lastName}</td>
                    <td className="py-3.5 px-4 text-slate-300">{cnt.salaryStructure?.name || "-"}</td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(cnt.startDate).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-slate-400">{cnt.endDate ? new Date(cnt.endDate).toLocaleDateString() : "-"}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">₹{Number(cnt.wage).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={cnt.status} />
                    </td>
<<<<<<< Updated upstream
                    {canManageContracts && (
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            if (cnt.status !== "DRAFT") {
                              toast.error("Only DRAFT contracts can be deleted.");
                            } else {
                              setDeleteId(cnt.id);
                            }
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${cnt.status === "DRAFT" ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-600 cursor-not-allowed'}`}
                          title={cnt.status === "DRAFT" ? "Delete Contract" : "Only DRAFT contracts can be deleted"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
=======
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/contracts/${cnt.id}/edit`); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#5B8DEF] hover:bg-[#5B8DEF]/10 transition-colors"
                          title="Edit Contract"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(cnt.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Contract"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
>>>>>>> Stashed changes
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmDeleteDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            const res = await removeContract(deleteId);
            if (res.success) {
              toast.success("Contract deleted");
            } else {
              toast.error(res.error || "Failed to delete contract");
            }
            setDeleteId(null);
          }}
          title="Delete Contract Agreement"
          description="Are you sure you want to delete this contract? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default ContractList;
