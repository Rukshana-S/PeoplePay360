import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContracts } from "../../hooks/useContracts";
import { useEmployees } from "../../hooks/useEmployees";
import { usePayroll } from "../../hooks/usePayroll";
import PageHeader from "../../components/shared/PageHeader";
import FormActions from "../../components/shared/FormActions";
import InfoCard from "../../components/shared/InfoCard";
import { FileText, DollarSign, Calendar } from "lucide-react";
import { toast } from "react-toastify";

const ContractCreate = () => {
  const navigate = useNavigate();
  const { addContract, contracts } = useContracts();
  const { employees, loading: empLoading } = useEmployees();
  const { salaryStructures, salaryRules, loading: structLoading } = usePayroll();

  const [formData, setFormData] = useState({
    employeeId: "",
    salaryStructureId: "",
    wage: 100000,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "ACTIVE",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasActiveContract, setHasActiveContract] = useState(false);

  useEffect(() => {
    const active = contracts.some(
      (c) => c.employeeId === formData.employeeId && c.status === "ACTIVE"
    );
    setHasActiveContract(active);
  }, [formData.employeeId, contracts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.salaryStructureId) {
      toast.error("Employee and Salary Structure are required");
      return;
    }

    if (Number(formData.wage) <= 0) {
      toast.error("Annual wage must be greater than zero");
      return;
    }

    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("End Date must be greater than Start Date");
      return;
    }

    if (hasActiveContract && formData.status === "ACTIVE") {
      toast.error("Employee already has an active contract during this period.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Auto-fill department, job, schedule from the selected employee
    const selectedEmp = employees.find(emp => emp.id === formData.employeeId);
    
    const payload = {
      employeeId: formData.employeeId,
      salaryStructureId: formData.salaryStructureId,
      departmentId: selectedEmp?.departmentId,
      jobPositionId: selectedEmp?.jobPositionId,
      scheduleId: selectedEmp?.scheduleId || null,
      wage: Number(formData.wage),
      startDate: new Date(formData.startDate).toISOString(),
      status: formData.status
    };

    if (formData.endDate) {
      payload.endDate = new Date(formData.endDate).toISOString();
    }

    const res = await addContract(payload);
    setIsSubmitting(false);
    
    if (res.success) {
      toast.success("Contract created successfully");
      navigate(`/contracts/${res.data.id}`);
    } else {
      toast.error(res.error || "Failed to create contract");
    }
  };

  if (empLoading || structLoading) {
    return <div className="p-6 text-white">Loading data...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Create New Contract"
        subtitle="Issue an employment agreement, assign salary structure, and define terms"
        showBack
        backPath="/contracts"
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#1E293B]">
            <div className="w-12 h-12 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Contract Details & Remuneration</h2>
              <p className="text-xs text-slate-400">Specify employee, salary structure, wage, and contract validity period</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Select Employee *</label>
              <select
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
              >
                <option value="">Select Employee</option>
                {employees.filter(emp => emp.status !== 'TERMINATED').map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Salary Structure *</label>
              <select
                required
                value={formData.salaryStructureId}
                onChange={(e) => setFormData({ ...formData, salaryStructureId: e.target.value })}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
              >
                <option value="">Select Structure</option>
                {salaryStructures.map((struct) => (
                  <option key={struct.id} value={struct.id}>
                    {struct.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Annual Contract Wage (₹) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.wage}
                  onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-emerald-400 font-bold focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Contract Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
              >
                <option value="ACTIVE">Active (Running)</option>
                <option value="DRAFT">Draft</option>
                <option value="EXPIRED">Expired</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Start Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white font-mono focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">End Date (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white font-mono focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {hasActiveContract && formData.status === "ACTIVE" && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <h3 className="font-bold text-rose-400 mb-1">Active Contract Exists</h3>
              <p className="text-sm text-rose-300">Employee already has an active contract during this period. Please expire the existing contract or save this one as a DRAFT.</p>
            </div>
          )}

          {formData.salaryStructureId && (
            <div className="mt-6 border-t border-[#1E293B] pt-6">
              <h3 className="text-sm font-bold text-white mb-4">Salary Breakdown Preview (Annual)</h3>
              <div className="bg-[#020817] rounded-lg border border-[#1E293B] overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-[#1E293B]/50 border-b border-[#1E293B]">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold text-slate-400">Rule Name</th>
                      <th className="py-2.5 px-4 font-semibold text-slate-400">Type</th>
                      <th className="py-2.5 px-4 font-semibold text-slate-400 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]">
                    {(() => {
                      const rules = salaryRules
                        .filter(r => r.salaryStructureId === formData.salaryStructureId)
                        .sort((a, b) => a.sequence - b.sequence);
                      
                      if (rules.length === 0) {
                        return (
                          <tr>
                            <td colSpan="3" className="py-4 px-4 text-center text-slate-500">No rules configured for this structure.</td>
                          </tr>
                        );
                      }

                      let netAmount = 0;
                      let baseAmount = Number(formData.wage) || 0;

                      return (
                        <>
                          <tr>
                            <td className="py-2.5 px-4 font-bold text-slate-200">Base Wage</td>
                            <td className="py-2.5 px-4 text-slate-400">Fixed</td>
                            <td className="py-2.5 px-4 text-right font-bold text-emerald-400">{baseAmount.toLocaleString()}</td>
                          </tr>
                          {rules.map(rule => {
                            let calculatedAmount = 0;
                            if (rule.amountType === 'FIXED') {
                              calculatedAmount = rule.amount;
                            } else if (rule.amountType === 'PERCENTAGE') {
                              calculatedAmount = (baseAmount * rule.amount) / 100;
                            }

                            if (rule.type === 'EARNING') netAmount += calculatedAmount;
                            else if (rule.type === 'DEDUCTION') netAmount -= calculatedAmount;
                            
                            return (
                              <tr key={rule.id}>
                                <td className="py-2.5 px-4">{rule.name}</td>
                                <td className="py-2.5 px-4">
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${rule.type === 'EARNING' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                    {rule.type}
                                  </span>
                                </td>
                                <td className={`py-2.5 px-4 text-right ${rule.type === 'DEDUCTION' ? 'text-rose-400' : 'text-slate-200'}`}>
                                  {rule.type === 'DEDUCTION' ? '-' : ''}{calculatedAmount.toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="bg-[#1E293B]/30 font-bold">
                            <td colSpan="2" className="py-3 px-4 text-white">Estimated Net Total</td>
                            <td className="py-3 px-4 text-right text-[#5B8DEF] text-lg">{netAmount.toLocaleString()}</td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <FormActions
            onCancel={() => navigate("/contracts")}
            isSubmitting={isSubmitting}
            saveLabel="Issue Contract"
          />
        </form>
      </div>
    </div>
  );
};

export default ContractCreate;
