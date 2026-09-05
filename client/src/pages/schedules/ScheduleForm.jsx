import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { CalendarDays, Info } from "lucide-react";
import * as api from "../../api/schedules";
import { toast } from "react-toastify";

const ScheduleForm = () => {
  const { id } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await api.getScheduleById(id);
        setSchedule(res.data || res);
      } catch (err) {
        toast.error("Failed to load schedule details");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [id]);

  if (loading) return <div className="text-white p-6">Loading schedule details...</div>;
  if (!schedule) return <div className="text-white p-6">Schedule not found.</div>;

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calcDailyHours = (startStr, endStr, breakMins) => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start) || isNaN(end)) return 0;
    const diffMs = end.getTime() - start.getTime();
    const workedMinutes = (diffMs / (1000 * 60)) - (breakMins || 0);
    return workedMinutes > 0 ? Number((workedMinutes / 60).toFixed(2)) : 0;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <MockRbacNotice moduleKey="schedules" moduleName={`Schedule Details (${schedule.name})`} />

      <PageHeader
        title={`Schedule: ${schedule.name}`}
        subtitle={`Working Hours Configuration`}
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
              <p className="text-xs text-slate-400">Assigned to {schedule._count?.employees || 0} employees</p>
            </div>
          </div>

          <div className="bg-[#020817] border border-[#1E293B] px-4 py-2 rounded-xl text-right">
            <span className="text-xs text-slate-400 font-medium">Total Weekly Hours</span>
            <p className="text-lg font-bold text-emerald-400">{Number(schedule.weeklyHours)} Hours</p>
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
              {schedule.days?.map((dayRow, idx) => {
                const dailyHours = calcDailyHours(dayRow.startTime, dayRow.endTime, dayRow.breakMinutes);
                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{dayRow.weekday}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">{formatTime(dayRow.startTime)}</td>
                    <td className="py-3.5 px-4 font-mono text-amber-400">{formatTime(dayRow.endTime)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{dayRow.breakMinutes > 0 ? `${dayRow.breakMinutes} mins` : "None"}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      {dailyHours > 0 ? `${dailyHours} hrs` : <span className="text-slate-500 font-normal">Off</span>}
                    </td>
                  </tr>
                );
              })}
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
