import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PAYRUNS, PAYSLIPS } from "../../data/payroll";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { CircleDollarSign, AlertTriangle, Calculator, CheckCircle, Send, CreditCard } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

const PayrunProcessing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialPayrun = PAYRUNS.find((p) => p.id === id) || PAYRUNS[0];
  const [payrunStatus, setPayrunStatus] = useState(initialPayrun.status);

  const payrunSlips = PAYSLIPS.filter((ps) => ps.payrunId === initialPayrun.id || initialPayrun.id === "pr-101");

  const handleCompute = () => {
    setPayrunStatus("Computing");
    setTimeout(() => {
      setPayrunStatus("Draft");
      toast.success("Payrun computed! 6 payslip breakdown lines updated.");
    }, 600);
  };

  const handleValidate = () => {
    setPayrunStatus("Validated");
    toast.success("Payrun batch validated and locked for audit!");
  };

  const handleMarkPaid = () => {
    setPayrunStatus("Paid");
    toast.success("Disbursement recorded! Status marked as Paid.");
  };

  const handleSendPayslips = () => {
    toast.info("Digital payslips emailed to all 6 included employees!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="payruns" moduleName={`Payrun Processing (${initialPayrun.name})`} />

      <PageHeader
        title={initialPayrun.name}
        subtitle={`Payrun Period: ${initialPayrun.period}`}
        showBack
        backPath="/payroll/payruns"
      />

      {/* Header Actions & Status Bar */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
              <CircleDollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white tracking-tight">{initialPayrun.name}</h2>
                <StatusBadge status={payrunStatus} />
              </div>
              <p className="text-xs text-slate-400 mt-1">Structure: <span className="text-slate-200 font-semibold">{initialPayrun.structureName}</span></p>
            </div>
          </div>

          {/* Payrun Control Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleCompute}
              variant="outline"
              className="border-[#1E293B] text-slate-300 hover:bg-[#1E293B] text-xs h-9"
            >
              <Calculator className="w-4 h-4 mr-1.5 text-purple-400" />
              Compute Batch
            </Button>

            <Button
              onClick={handleValidate}
              disabled={payrunStatus === "Validated" || payrunStatus === "Paid"}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs h-9 px-4 shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Validate Batch
            </Button>

            <Button
              onClick={handleMarkPaid}
              disabled={payrunStatus === "Paid"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 px-4 shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4 mr-1.5" />
              Mark Paid
            </Button>

            <Button
              onClick={handleSendPayslips}
              variant="secondary"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs h-9"
            >
              <Send className="w-4 h-4 mr-1.5 text-[#5B8DEF]" />
              Send Payslips
            </Button>
          </div>
        </div>

        {/* Warnings Panel */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-200">Payrun Warnings & Pre-check Notice:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-amber-300/90">
              <li>Ethan Bennett has 1 unverified "Missing Checkout" attendance record.</li>
              <li>James Wilson is currently marked "On Leave" for 3 days during this pay period.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Included Payslips Table */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#1E293B] font-bold text-white text-sm flex items-center justify-between">
          <span>Generated Payslips ({payrunSlips.length})</span>
          <span className="text-xs text-slate-400 font-normal">Click any row to open full rule calculation sheet</span>
        </div>

        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Salary Structure</th>
              <th className="py-3.5 px-4">Gross Amount</th>
              <th className="py-3.5 px-4">Net Payable</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {payrunSlips.map((ps) => (
              <tr
                key={ps.id}
                onClick={() => navigate(`/payroll/payslips/${ps.id}`)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-bold text-white">{ps.employeeName}</td>
                <td className="py-3.5 px-4 text-slate-400">{ps.structureName}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-200">₹{ps.gross.toLocaleString()}</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">₹{ps.net.toLocaleString()}</td>
                <td className="py-3.5 px-4"><StatusBadge status={ps.status} /></td>
                <td className="py-3.5 px-4 text-right text-[#5B8DEF] font-medium">View Breakdown →</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrunProcessing;
