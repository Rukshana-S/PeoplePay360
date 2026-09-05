import React from "react";
import { useParams } from "react-router-dom";
import { TIME_OFF_REQUESTS, LEAVE_ALLOCATIONS } from "../../data/timeOff";
import { EMPLOYEES } from "../../data/employees";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";

const EmployeeTimeOff = () => {
  const { id } = useParams();
  const employee = EMPLOYEES.find((e) => e.id === id) || EMPLOYEES[0];

  const requests = TIME_OFF_REQUESTS.filter((r) => r.employeeId === employee.id || r.employeeName === employee.name);
  const allocations = LEAVE_ALLOCATIONS.filter((a) => a.employeeId === employee.id || a.employeeName === employee.name);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <MockRbacNotice moduleKey="timeOffRequests" moduleName={`Time Off Overview for ${employee.name}`} />

      <PageHeader
        title={`Time Off: ${employee.name}`}
        subtitle={`Leave requests and available leave allocations for ${employee.name}`}
        showBack
        backPath={`/employees/${employee.id}`}
      />

      {/* Allocation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allocations.map((alloc) => (
          <div key={alloc.id} className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-white text-sm">{alloc.leaveType}</h3>
            <div className="flex justify-between items-end pt-2 border-t border-[#1E293B]">
              <div>
                <p className="text-[11px] text-slate-400">Allocated: {alloc.allocated} days</p>
                <p className="text-[11px] text-slate-400">Taken: {alloc.taken} days</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-[#5B8DEF]">{alloc.remaining}</span>
                <span className="text-xs text-slate-400 block">Days Left</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#1E293B] font-bold text-white text-sm">
          Submitted Requests
        </div>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Leave Type</th>
              <th className="py-3.5 px-4">Dates</th>
              <th className="py-3.5 px-4">Duration</th>
              <th className="py-3.5 px-4">Reason</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white">{req.leaveType}</td>
                <td className="py-3.5 px-4 text-slate-400">{req.startDate} to {req.endDate}</td>
                <td className="py-3.5 px-4 font-medium text-slate-200">{req.duration}</td>
                <td className="py-3.5 px-4 text-slate-400">{req.reason}</td>
                <td className="py-3.5 px-4"><StatusBadge status={req.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTimeOff;
