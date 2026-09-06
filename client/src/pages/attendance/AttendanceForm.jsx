import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAttendance } from "../../hooks/useAttendance";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { CalendarCheck, User, CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import * as api from "../../api/axios";

const AttendanceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { attendance, loading, fetchAttendance } = useAttendance();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("");

  const log = attendance.find((a) => a.id === id);

  useEffect(() => {
    if (log) {
      setCheckIn(log.checkIn ? new Date(log.checkIn).toISOString().slice(0, 16) : "");
      setCheckOut(log.checkOut ? new Date(log.checkOut).toISOString().slice(0, 16) : "");
      setStatus(log.status || "");
    }
  }, [log]);

  const handleSaveCorrection = async (e) => {
    e.preventDefault();
    try {
      await api.default.put(`/attendance/${id}`, {
        checkIn: checkIn ? new Date(checkIn).toISOString() : null,
        checkOut: checkOut ? new Date(checkOut).toISOString() : null,
        status,
      });
      toast.success("Manual correction saved!");
      await fetchAttendance();
      navigate("/attendance");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update log");
    }
  };

  if (loading) return <div className="p-6 text-white">Loading attendance...</div>;
  if (!log) return <div className="p-6 text-rose-400">Attendance log not found</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <MockRbacNotice moduleKey="attendance" moduleName={`Attendance Log (${new Date(log.date).toLocaleDateString()})`} />

      <PageHeader
        title={`Attendance Correction: ${log.employee?.firstName} ${log.employee?.lastName}`}
        subtitle={`Manual Correction UI • Log Date: ${new Date(log.date).toLocaleDateString()}`}
        showBack
        backPath="/attendance"
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{log.employee?.firstName} {log.employee?.lastName}</h2>
              <p className="text-xs text-slate-400">Log Date: <span className="text-slate-200 font-mono">{new Date(log.date).toLocaleDateString()}</span></p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <form onSubmit={handleSaveCorrection} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Employee</label>
            <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#5B8DEF]" />
              <span className="font-semibold">{log.employee?.firstName} {log.employee?.lastName}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Check In Time</label>
              <input
                type="datetime-local"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-emerald-400 font-mono focus:border-[#5B8DEF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Check Out Time</label>
              <input
                type="datetime-local"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-amber-400 font-mono focus:border-[#5B8DEF] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Status Classification</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
              >
                <option value="PRESENT">PRESENT</option>
                <option value="LATE">LATE</option>
                <option value="ABSENT">ABSENT</option>
                <option value="HALF_DAY">HALF DAY</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E293B] flex justify-end">
            <Button
              type="submit"
              className="bg-[#5B8DEF] hover:bg-[#4a7ad8] text-white font-semibold px-5 h-10 rounded-lg flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply Manual Correction</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceForm;
