import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as api from "../../api/payroll";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { User, Building2, Calendar, Printer } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

const PayslipView = () => {
  const { id } = useParams();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        setLoading(true);
        const res = await api.getPayslipById(id);
        setPayslip(res.data || res);
      } catch (err) {
        toast.error("Failed to fetch payslip details");
      } finally {
        setLoading(false);
      }
    };
    fetchPayslip();
  }, [id]);

  if (loading) return <div className="p-6 text-white">Loading payslip...</div>;
  if (!payslip) return <div className="p-6 text-rose-400">Payslip not found</div>;

  const employee = payslip.employee || {};
  const breakdownLines = payslip.lines || [];
  const empName = `${employee.firstName || ""} ${employee.lastName || ""}`.trim() || "Unknown";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <MockRbacNotice moduleKey="payslips" moduleName={`Payslip (${empName})`} className="print-hidden" />

      <PageHeader
        title={`Payslip: ${empName}`}
        subtitle={`Period: ${new Date(payslip.payrun?.periodStart).toLocaleDateString()} - ${new Date(payslip.payrun?.periodEnd).toLocaleDateString()}`}
        showBack
        backPath="/payroll/payslips"
        className="print-hidden"
      >
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="print-hidden border-[#1E293B] text-slate-300 hover:bg-[#1E293B] text-xs h-9"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Print / PDF
        </Button>
      </PageHeader>

      {/* Main Payslip Container */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B8DEF] to-indigo-600 border border-[#5B8DEF]/30 flex items-center justify-center font-bold text-white text-lg">
              P360
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">PeoplePay360 Payslip Statement</h2>
              <p className="text-xs text-slate-400">Pay Period: <span className="text-slate-200 font-mono">{new Date(payslip.payrun?.periodStart).toLocaleDateString()} - {new Date(payslip.payrun?.periodEnd).toLocaleDateString()}</span></p>
            </div>
          </div>
          <StatusBadge status={payslip.status} />
        </div>

        {/* Employee Header Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#020817] p-4 rounded-xl border border-[#1E293B] text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Employee Name</span>
            <span className="font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
              <User className="w-3.5 h-3.5 text-[#5B8DEF]" /> {empName}
            </span>
            <span className="text-slate-400 text-[11px] block mt-0.5">{employee.employeeCode || "N/A"}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Department & Role</span>
            <span className="font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-purple-400" /> {employee.department?.name || employee.department || "N/A"}
            </span>
            <span className="text-slate-400 text-[11px] block mt-0.5">{employee.jobPosition?.title || employee.jobPosition || "N/A"}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Salary Structure</span>
            <span className="font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {payslip.payrun?.salaryStructure?.name || "N/A"}
            </span>
          </div>
        </div>

        {/* Rule Breakdown Table */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3">Salary Computation Breakdown Lines</h3>
          <div className="border border-[#1E293B] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
                <tr>
                  <th className="py-3 px-4">Rule Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60">
                {breakdownLines.map((line, idx) => {
                  const isGrossOrNet = line.category === "GROSS" || line.category === "NET";
                  return (
                    <tr
                      key={idx}
                      className={
                        line.category === "NET"
                          ? "bg-[#5B8DEF]/10 font-bold text-white"
                          : isGrossOrNet
                          ? "bg-slate-800/60 font-semibold text-white"
                          : "hover:bg-slate-800/40"
                      }
                    >
                      <td className="py-3 px-4">{line.salaryRule?.name || line.ruleName}</td>
                      <td className="py-3 px-4 font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          line.category === "BASIC" || line.category === "ALW" ? "bg-emerald-500/10 text-emerald-400" :
                          line.category === "DED" ? "bg-rose-500/10 text-rose-400" : "bg-purple-500/10 text-purple-400"
                        }`}>
                          {line.category}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right font-mono ${
                        line.category === "DED" ? "text-rose-400" :
                        line.category === "NET" ? "text-emerald-400 text-base" : "text-white"
                      }`}>
                        {line.category === "DED" ? `- ₹${Number(line.amount).toLocaleString()}` : `₹${Number(line.amount).toLocaleString()}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Salary Highlight Footer */}
        <div className="bg-[#020817] p-5 rounded-xl border border-[#1E293B] flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Net Amount Disbursed</span>
            <span className="text-xs text-slate-400 mt-0.5 block">Direct Deposit to Employee Bank Account</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-emerald-400">₹{Number(payslip.netSalary).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipView;
