import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ATTENDANCE_LOGS } from "../../data/attendance";
import { EMPLOYEES } from "../../data/employees";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";

const EmployeeAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const employee = EMPLOYEES.find((e) => e.id === id) || EMPLOYEES[0];
  const logs = ATTENDANCE_LOGS.filter((a) => a.employeeId === employee.id || a.employeeName === employee.name);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <MockRbacNotice moduleKey="attendance" moduleName={`Attendance Logs for ${employee.name}`} />

      <PageHeader
        title={`Attendance: ${employee.name}`}
        subtitle={`Clock-in & worked hours history for ${employee.name}`}
        showBack
        backPath={`/employees/${employee.id}`}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Check In</th>
              <th className="py-3.5 px-4">Check Out</th>
              <th className="py-3.5 px-4">Worked Hours</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {logs.map((att) => (
              <tr
                key={att.id}
                onClick={() => navigate(`/attendance/${att.id}`)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-medium text-slate-200">{att.date}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400">{att.checkIn}</td>
                <td className="py-3.5 px-4 font-mono text-amber-400">{att.checkOut}</td>
                <td className="py-3.5 px-4 font-semibold text-white">{att.workedHours} hrs</td>
                <td className="py-3.5 px-4"><StatusBadge status={att.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
