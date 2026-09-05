import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ATTENDANCE_LOGS } from "../../data/attendance";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { toast } from "react-toastify";

const AttendanceList = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredLogs = ATTENDANCE_LOGS.filter((a) =>
    a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    a.status.toLowerCase().includes(search.toLowerCase()) ||
    a.date.includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="attendance" moduleName="Attendance Logs" />

      <PageHeader
        title="Attendance Logs"
        subtitle="Track workforce check-ins, check-outs, worked hours, and overtime"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="Check In / Out"
        onActionClick={() => toast.success("Attendance Check-In recorded for active user!")}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Check In</th>
              <th className="py-3.5 px-4">Check Out</th>
              <th className="py-3.5 px-4">Worked Hours</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {filteredLogs.map((att) => (
              <tr
                key={att.id}
                onClick={() => navigate(`/attendance/${att.id}`)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-medium text-slate-200">{att.date}</td>
                <td className="py-3.5 px-4 font-semibold text-white">{att.employeeName}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400">{att.checkIn}</td>
                <td className="py-3.5 px-4 font-mono text-amber-400">{att.checkOut}</td>
                <td className="py-3.5 px-4 font-bold text-white">{att.workedHours} hrs</td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={att.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
