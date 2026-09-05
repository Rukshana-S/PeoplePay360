import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SCHEDULES } from "../../data/schedules";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { Clock, CalendarDays } from "lucide-react";
import { toast } from "react-toastify";

const ScheduleList = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredSchedules = SCHEDULES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="schedules" moduleName="Working Schedules" />

      <PageHeader
        title="Working Schedules"
        subtitle="Define standard weekly working hours, shifts, and break times"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="New Schedule"
        onActionClick={() => toast.info("New Schedule form ready.")}
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
            <tr>
              <th className="py-3.5 px-4">Schedule Name</th>
              <th className="py-3.5 px-4">Schedule Type</th>
              <th className="py-3.5 px-4">Weekly Expected Hours</th>
              <th className="py-3.5 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {filteredSchedules.map((sch) => (
              <tr
                key={sch.id}
                onClick={() => navigate(`/working-schedules/${sch.id}`)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-sm">{sch.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-400">{sch.type}</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-400">{sch.weeklyHours} hours / week</td>
                <td className="py-3.5 px-4 text-[#5B8DEF] font-medium">View Schedule →</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleList;
