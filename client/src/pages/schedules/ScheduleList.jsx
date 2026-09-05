import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedules } from "../../hooks/useSchedules";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import { CalendarDays, Plus, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

const ScheduleList = () => {
  const { schedules, loading, error, addSchedule } = useSchedules();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Standard");
  const navigate = useNavigate();

  const filteredSchedules = schedules.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSchedule = async (e) => {
    e.preventDefault();

    let days = [];
    if (type === "Standard") {
      // 40h
      days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((weekday) => ({
        weekday,
        startTime: "1970-01-01T09:00:00Z",
        endTime: "1970-01-01T18:00:00Z",
        breakMinutes: 60
      }));
    } else if (type === "Part-Time") {
      // 20h
      days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((weekday) => ({
        weekday,
        startTime: "1970-01-01T09:00:00Z",
        endTime: "1970-01-01T13:00:00Z",
        breakMinutes: 0
      }));
    } else {
      // Night Shift 40h
      days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((weekday) => ({
        weekday,
        startTime: "1970-01-01T22:00:00Z",
        endTime: "1970-01-02T06:00:00Z",
        breakMinutes: 0
      }));
    }

    const payload = {
      name,
      days
    };

    const res = await addSchedule(payload);
    if (res.success) {
      toast.success("Schedule created successfully");
      setName("");
      setIsModalOpen(false);
    } else {
      toast.error(res.error || "Failed to create schedule");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="schedules" moduleName="Working Schedules" />

      <PageHeader
        title="Working Schedules"
        subtitle="Define standard weekly working hours, shifts, and break times"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel="New Schedule"
        onActionClick={() => setIsModalOpen(true)}
      />

      {loading ? (
        <div className="text-white p-6">Loading schedules...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : filteredSchedules.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No schedules found"
          description="Create a new schedule configuration for your workforce."
          actionLabel="Create Schedule"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020817] text-slate-400 font-semibold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3.5 px-4">Schedule Name</th>
                <th className="py-3.5 px-4">Weekly Expected Hours</th>
                <th className="py-3.5 px-4">Linked Employees</th>
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
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">{Number(sch.weeklyHours)} hours / week</td>
                  <td className="py-3.5 px-4 text-slate-400">{sch._count?.employees || 0} Employees</td>
                  <td className="py-3.5 px-4 text-[#5B8DEF] font-medium">View Schedule →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-lg font-bold text-white">Create Working Schedule</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Schedule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard 40H"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Template Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                >
                  <option value="Standard">Standard Full-Time (40h) - 9AM to 6PM</option>
                  <option value="Part-Time">Part-Time (20h) - 9AM to 1PM</option>
                  <option value="Night Shift">Night Shift (40h) - 10PM to 6AM</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Select a template. You can customize daily hours in the details page after creation.</p>
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent border border-[#1E293B] text-slate-300 hover:bg-slate-800 px-4 h-9 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#5B8DEF] hover:bg-[#4a7ad8] text-white px-4 h-9 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Schedule</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
