import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSchedules } from "../../hooks/useSchedules";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import ConfirmDeleteDialog from "../../components/shared/ConfirmDeleteDialog";
import FormActions from "../../components/shared/FormActions";
import { CalendarDays, Info, Trash2, Plus, Edit } from "lucide-react";
import * as api from "../../api/schedules";
import { toast } from "react-toastify";

const ScheduleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateSchedule, removeSchedule } = useSchedules();
  
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", days: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await api.getScheduleById(id);
        const data = res.data || res;
        setSchedule(data);
        setFormData({ name: data.name, days: data.days || [] });
      } catch (err) {
        toast.error("Failed to load schedule details");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [id]);

  const calcDailyHours = (startStr, endStr, breakMins) => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start) || isNaN(end)) return 0;
    let diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) {
      // Night shift logic, add 24 hours
      diffMs += 24 * 60 * 60 * 1000;
    }
    const workedMinutes = (diffMs / (1000 * 60)) - (breakMins || 0);
    return workedMinutes > 0 ? Number((workedMinutes / 60).toFixed(2)) : 0;
  };

  const calculateTotalWeekly = (daysList) => {
    return daysList.reduce((acc, day) => acc + calcDailyHours(day.startTime, day.endTime, day.breakMinutes), 0);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await updateSchedule(id, formData);
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Schedule updated successfully");
      setSchedule(res.data);
      setIsEditing(false);
    } else {
      toast.error(res.error || "Failed to update schedule");
    }
  };

  const handleDelete = async () => {
    if (schedule?._count?.employees > 0) {
      toast.error("Schedule is assigned to employees. Cannot delete.");
      setDeleteDialogOpen(false);
      return;
    }
    const res = await removeSchedule(id);
    if (res.success) {
      toast.success("Schedule deleted");
      navigate("/working-schedules");
    } else {
      toast.error(res.error || "Failed to delete schedule");
    }
  };

  const addDay = () => {
    setFormData(prev => ({
      ...prev,
      days: [
        ...prev.days,
        { weekday: "Monday", startTime: "1970-01-01T09:00:00Z", endTime: "1970-01-01T18:00:00Z", breakMinutes: 60 }
      ]
    }));
  };

  const removeDay = (index) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.filter((_, i) => i !== index)
    }));
  };

  const updateDay = (index, field, value) => {
    setFormData(prev => {
      const newDays = [...prev.days];
      newDays[index] = { ...newDays[index], [field]: value };
      return { ...prev, days: newDays };
    });
  };

  const formatTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toTimeString().substring(0, 5); // HH:MM
  };

  const handleTimeChange = (index, field, timeValue) => {
    // Convert HH:MM back to 1970-01-01 or 1970-01-02 based on shift
    const baseDateStr = "1970-01-01T";
    updateDay(index, field, `${baseDateStr}${timeValue}:00Z`);
  };

  if (loading) return <div className="text-white p-6">Loading schedule details...</div>;
  if (!schedule) return <div className="text-white p-6">Schedule not found.</div>;

  const currentDays = isEditing ? formData.days : schedule.days;
  const weeklyTotal = calculateTotalWeekly(currentDays);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <MockRbacNotice moduleKey="schedules" moduleName={`Schedule Details (${schedule.name})`} />

      <PageHeader
        title={`Schedule: ${isEditing ? formData.name : schedule.name}`}
        subtitle={`Working Hours Configuration`}
        showBack
        backPath="/working-schedules"
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
            <div className="flex items-center gap-3 w-full max-w-md">
              <div className="w-12 h-12 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF] shrink-0">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div className="w-full">
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white font-bold"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-white tracking-tight">{schedule.name}</h2>
                )}
                <p className="text-xs text-slate-400">Assigned to {schedule._count?.employees || 0} employees</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#020817] border border-[#1E293B] px-4 py-2 rounded-xl text-right">
                <span className="text-xs text-slate-400 font-medium">Total Weekly Hours</span>
                <p className="text-lg font-bold text-emerald-400">{weeklyTotal} Hours</p>
              </div>
              
              {!isEditing && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-lg bg-[#5B8DEF]/10 text-[#5B8DEF] hover:bg-[#5B8DEF]/20 transition-colors"
                    title="Edit Schedule"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                    title="Delete Schedule"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="border border-[#1E293B] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
                <tr>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Start Time</th>
                  <th className="py-3 px-4">End Time</th>
                  <th className="py-3 px-4">Break (Mins)</th>
                  <th className="py-3 px-4 text-right">Hours</th>
                  {isEditing && <th className="py-3 px-4 w-12"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60">
                {currentDays.map((dayRow, idx) => {
                  const dailyHours = calcDailyHours(dayRow.startTime, dayRow.endTime, dayRow.breakMinutes);
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <select
                            value={dayRow.weekday}
                            onChange={(e) => updateDay(idx, "weekday", e.target.value)}
                            className="w-full p-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white"
                          >
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="font-bold text-white">{dayRow.weekday}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="time"
                            required
                            value={formatTimeLocal(dayRow.startTime)}
                            onChange={(e) => handleTimeChange(idx, "startTime", e.target.value)}
                            className="w-full p-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-emerald-400 font-mono"
                          />
                        ) : (
                          <span className="font-mono text-emerald-400">{formatTimeLocal(dayRow.startTime)}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="time"
                            required
                            value={formatTimeLocal(dayRow.endTime)}
                            onChange={(e) => handleTimeChange(idx, "endTime", e.target.value)}
                            className="w-full p-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-amber-400 font-mono"
                          />
                        ) : (
                          <span className="font-mono text-amber-400">{formatTimeLocal(dayRow.endTime)}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            required
                            value={dayRow.breakMinutes}
                            onChange={(e) => updateDay(idx, "breakMinutes", Number(e.target.value))}
                            className="w-full p-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white"
                          />
                        ) : (
                          <span className="text-slate-400">{dayRow.breakMinutes > 0 ? `${dayRow.breakMinutes} mins` : "None"}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-white">
                        {dailyHours > 0 ? `${dailyHours} hrs` : <span className="text-slate-500 font-normal">Off</span>}
                      </td>
                      {isEditing && (
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => removeDay(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {isEditing && (
              <div className="p-3 bg-[#020817]/50 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={addDay}
                  className="text-xs font-semibold text-[#5B8DEF] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Working Day
                </button>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="p-4 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/20 text-slate-300 text-xs flex items-center gap-3">
              <Info className="w-5 h-5 text-[#5B8DEF] shrink-0" />
              <p>
                <strong className="text-white">Business Rule Note:</strong> Working Schedule defines attendance expectations and overtime thresholds for clock-ins.
              </p>
            </div>
          )}

          {isEditing && (
            <FormActions
              onCancel={() => {
                setIsEditing(false);
                setFormData({ name: schedule.name, days: schedule.days });
              }}
              isSubmitting={isSubmitting}
              saveLabel="Save Changes"
            />
          )}
        </form>
      </div>

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Working Schedule"
        description="Are you sure you want to delete this schedule? This action cannot be undone and is only allowed if no employees are assigned."
      />
    </div>
  );
};

export default ScheduleForm;
