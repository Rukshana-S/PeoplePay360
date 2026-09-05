import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useEmployees } from "../../hooks/useEmployees";
import { usePayroll } from "../../hooks/usePayroll";
import { useTimeOff } from "../../hooks/useTimeOff";
import { getRoleDisplayName } from "../../utils/rolePermissions";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import FilterBar from "../../components/shared/FilterBar";
import {
  TrendingUp,
  DollarSign,
  FileCheck2,
  CalendarCheck2,
  UserCheck,
  AlertCircle,
  Building2,
} from "lucide-react";

const ReportsDashboard = () => {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { payslips } = usePayroll();
  const { requests: leaveRequests } = useTimeOff();
  const role = user?.role || "EMPLOYEE";

  const [deptFilter, setDeptFilter] = useState("ALL");

  const totalNet = payslips.reduce((sum, p) => sum + (Number(p.netSalary) || 0), 0);
  const avgNet = payslips.length > 0 ? Math.round(totalNet / payslips.length) : 0;
  const approvedLeaves = leaveRequests.filter((l) => l.status === "APPROVED").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="reports" moduleName="HR & Payroll Analytics Dashboard" />

      <PageHeader
        title="Executive Reports & Analytics"
        subtitle={`Real-time HR analytics & financial reporting • Logged as ${getRoleDisplayName(role)}`}
      />

      <FilterBar
        filters={[
          {
            key: "dept",
            label: "Department",
            value: deptFilter,
            options: [
              { label: "All Departments", value: "ALL" },
              { label: "Engineering", value: "Engineering" },
              { label: "Human Resources", value: "Human Resources" },
              { label: "Product Management", value: "Product Management" },
              { label: "Design", value: "Design" },
            ],
            onChange: setDeptFilter,
          },
        ]}
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Net Salary</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white">₹{totalNet.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-400 font-medium">Active payroll total</span>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Payslips Generated</span>
            <FileCheck2 className="w-4 h-4 text-[#5B8DEF]" />
          </div>
          <p className="text-xl font-bold text-white">{payslips.length} Payslips</p>
          <span className="text-[10px] text-[#5B8DEF] font-medium">100% processing rate</span>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Net Salary</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-white">₹{avgNet.toLocaleString()}</p>
          <span className="text-[10px] text-purple-400 font-medium">Per employee average</span>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Workforce</span>
            <UserCheck className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-xl font-bold text-white">{employees.length} Staff</p>
          <span className="text-[10px] text-teal-400 font-medium">Registered workforce</span>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Approved Leave</span>
            <CalendarCheck2 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white">{approvedLeaves} Requests</p>
        </div>
      </div>

      {/* Mock Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Salary Breakdown Bar Chart */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="font-bold text-white text-sm">Salary Expense by Department</h3>
            <span className="text-xs text-slate-400">Sep 2026</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Software Engineering</span>
                <span className="font-bold">₹17,853 (33%)</span>
              </div>
              <div className="w-full bg-[#020817] h-3 rounded-full overflow-hidden border border-[#1E293B]">
                <div className="bg-[#5B8DEF] h-full rounded-full" style={{ width: "33%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>System Administration</span>
                <span className="font-bold">₹16,008 (30%)</span>
              </div>
              <div className="w-full bg-[#020817] h-3 rounded-full overflow-hidden border border-[#1E293B]">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: "30%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Human Resources</span>
                <span className="font-bold">₹13,697 (25%)</span>
              </div>
              <div className="w-full bg-[#020817] h-3 rounded-full overflow-hidden border border-[#1E293B]">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "25%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Contractor & Intern Fees</span>
                <span className="font-bold">₹5,562 (12%)</span>
              </div>
              <div className="w-full bg-[#020817] h-3 rounded-full overflow-hidden border border-[#1E293B]">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "12%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="font-bold text-white text-sm">Monthly Payroll Expense Trend (2026)</h3>
            <span className="text-xs text-emerald-400 font-mono">+12% YTD Growth</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { month: "May", amount: 48000, height: "65%" },
              { month: "Jun", amount: 49500, height: "70%" },
              { month: "Jul", amount: 51000, height: "78%" },
              { month: "Aug", amount: 52400, height: "85%" },
              { month: "Sep", amount: 53120, height: "92%" },
              { month: "Oct (Proj)", amount: 55000, height: "100%" },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{(bar.amount / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full bg-gradient-to-t from-[#5B8DEF]/30 to-[#5B8DEF] rounded-t-lg transition-all group-hover:brightness-125"
                  style={{ height: bar.height }}
                />
                <span className="text-xs text-slate-400">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit & Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payroll Warnings Panel */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-[#1E293B] pb-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Payroll Exceptions & Audit Log
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#020817] border border-[#1E293B] flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-200">Ethan Bennett</p>
                <p className="text-slate-400 text-[11px]">1 Missing Checkout log on Sep 04</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px]">Flagged</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#020817] border border-[#1E293B] flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-200">James Wilson</p>
                <p className="text-slate-400 text-[11px]">3 Days Casual Leave in active pay period</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]">Leave Paid</span>
            </div>
          </div>
        </div>

        {/* Department Summary */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-[#1E293B] pb-2">
            <Building2 className="w-4 h-4 text-[#5B8DEF]" />
            Department Headcount & Cost Summary
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#020817] border border-[#1E293B] flex justify-between items-center">
              <span className="font-medium text-slate-200">Software Engineering</span>
              <span className="font-mono text-slate-400">2 Employees • ₹28,861 Net</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#020817] border border-[#1E293B] flex justify-between items-center">
              <span className="font-medium text-slate-200">Human Resources & Admin</span>
              <span className="font-mono text-slate-400">2 Employees • ₹31,551 Net</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
