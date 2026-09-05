import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePayroll } from "../../hooks/usePayroll";
import { useEmployees } from "../../hooks/useEmployees";
import PageHeader from "../../components/shared/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

const PayrunWizard = () => {
  const navigate = useNavigate();
  const { salaryStructures, runPayrun } = usePayroll();
  const { employees } = useEmployees();
  const [step, setStep] = useState(1);

  // Step 1 State
  const [structureId, setStructureId] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  // Step 2 State
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const toggleEmployee = (empId) => {
    if (selectedEmployees.includes(empId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== empId));
    } else {
      setSelectedEmployees([...selectedEmployees, empId]);
    }
  };

  const handleCreatePayrun = async () => {
    if (!structureId || !periodStart || !periodEnd) {
      toast.error("Please fill in all details");
      return;
    }
    const res = await runPayrun({
      salaryStructureId: structureId,
      periodStart,
      periodEnd,
      employeeIds: selectedEmployees,
    });
    if (res.success) {
      toast.success("Payrun generated successfully");
      navigate(`/payroll/payruns/${res.data.id}`);
    } else {
      toast.error(res.error || "Failed to generate payrun");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <MockRbacNotice moduleKey="payruns" moduleName="New Payrun Processing Wizard" />

      <PageHeader
        title="New Payrun Wizard"
        subtitle="Step-by-step wizard to setup, validate, and compute a salary batch"
        showBack
        backPath="/payroll/payruns"
      />

      {/* Progress Wizard Indicator */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex items-center justify-around text-xs">
        <div className={`flex items-center gap-2 font-semibold ${step >= 1 ? "text-[#5B8DEF]" : "text-slate-500"}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? "bg-[#5B8DEF] text-white" : "bg-slate-800 text-slate-400"}`}>
            1
          </span>
          <span>Step 1: Configuration & Structure</span>
        </div>
        <div className="h-0.5 w-16 bg-[#1E293B]" />
        <div className={`flex items-center gap-2 font-semibold ${step >= 2 ? "text-[#5B8DEF]" : "text-slate-500"}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? "bg-[#5B8DEF] text-white" : "bg-slate-800 text-slate-400"}`}>
            2
          </span>
          <span>Step 2: Employee Selection</span>
        </div>
      </div>

      {/* Step 1 View */}
      {step === 1 && (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-white border-b border-[#1E293B] pb-3">
            Step 1: Select Salary Structure & Payroll Period
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Salary Structure</label>
              <select
                value={structureId}
                onChange={(e) => setStructureId(e.target.value)}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
              >
                <option value="">Select Structure</option>
                {salaryStructures.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Period Start</label>
                <input
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white font-mono focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Period End</label>
                <input
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white font-mono focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E293B] flex justify-end">
            <Button
              type="button"
              onClick={() => {
                if (structureId && periodStart && periodEnd) {
                  setStep(2);
                  setSelectedEmployees(employees.map(e => e.id));
                } else {
                  toast.error("Please fill in all details");
                }
              }}
              className="bg-[#5B8DEF] hover:bg-[#4a7ad8] text-white font-semibold px-5 h-10 rounded-lg flex items-center gap-2"
            >
              <span>Continue to Employee Selection</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 View */}
      {step === 2 && (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h2 className="text-base font-bold text-white">
              Step 2: Select Included Employees ({selectedEmployees.length} selected)
            </h2>
            <button
              onClick={() => setSelectedEmployees(employees.map((e) => e.id))}
              className="text-xs text-[#5B8DEF] hover:underline font-semibold"
            >
              Select All Employees
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {employees.map((emp) => {
              const isSelected = selectedEmployees.includes(emp.id);
              return (
                <div
                  key={emp.id}
                  onClick={() => toggleEmployee(emp.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#5B8DEF]/10 border-[#5B8DEF]/40 text-white"
                      : "bg-[#020817] border-[#1E293B] text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded border-[#1E293B] text-[#5B8DEF] focus:ring-0"
                    />
                    <div>
                      <span className="font-semibold text-sm block leading-tight">{emp.firstName} {emp.lastName}</span>
                      <span className="text-xs text-slate-400">{emp.jobPosition} • {emp.department}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="border-[#1E293B] text-slate-300 hover:bg-[#1E293B]"
            >
              Back to Step 1
            </Button>

            <Button
              type="button"
              onClick={handleCreatePayrun}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 h-10 rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Payrun & Compute Batch</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrunWizard;
