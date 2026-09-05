import React from "react";
import { useParams } from "react-router-dom";
import { SCHEDULES } from "../../data/schedules";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { CalendarDays, Clock, Info } from "lucide-react";

const ScheduleForm = () => {
  const { id } = useParams();
  const schedule = SCHEDULES.find((s) => s.id === id) || SCHEDULES[0];

  const totalWeeklyHours = schedule.days.reduce((sum, d) => sum + d.dailyHours, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <MockRbacNotice moduleKey="schedules" moduleName={`Schedule Details (${schedule.name})`} />

      <PageHeader
        title={`Schedule: ${schedule.name}`}
        subtitle={`Working Hours Configuration • ${schedule.type}`}
        showBack
        backPath="/working-schedules"
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{schedule.name}</h2>
              <p className="text-xs text-slate-400">{schedule.type}</p>
            </div>
          </div>

          <div className="bg-[#020817] border border-[#1E293B] px-4 py-2 rounded-xl text-right">
            <span className="text-xs text-slate-400 font-medium">Total Weekly Hours</span>
            <p className="text-lg font-bold text-emerald-400">{totalWeeklyHours} Hours</p>
          </div>
        </div>

        {/* Days Table */}
        <div className="border border-[#1E293B] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Start Time</th>
                <th className="py-3 px-4">End Time</th>
                <th className="py-3 px-4">Break Duration</th>
                <th className="py-3 px-4 text-right">Calculated Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {schedule.days.map((dayRow, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{dayRow.day}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">{dayRow.start}</td>
                  <td className="py-3.5 px-4 font-mono text-amber-400">{dayRow.end}</td>
                  <td className="py-3.5 px-4 text-slate-400">{dayRow.breakHours > 0 ? `${dayRow.breakHours} hr` : "None"}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-white">
                    {dayRow.dailyHours > 0 ? `${dayRow.dailyHours} hrs` : <span className="text-slate-500 font-normal">Off</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Business Rule Note */}
        <div className="p-4 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/20 text-slate-300 text-xs flex items-center gap-3">
          <Info className="w-5 h-5 text-[#5B8DEF] shrink-0" />
          <p>
            <strong className="text-white">Business Rule Note:</strong> Working Schedule defines attendance expectations and overtime thresholds for clock-ins.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;
