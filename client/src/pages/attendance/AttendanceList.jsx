import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAttendance } from "../../hooks/useAttendance";
import { useEmployees } from "../../hooks/useEmployees";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import EmptyState from "../../components/shared/EmptyState";
import { CalendarCheck, LogIn, LogOut, X, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const AttendanceList = () => {
  const { user } = useAuth();
  const isEmployee = user?.role === 'EMPLOYEE';
  const isHRManager = user?.role === 'HR_MANAGER';
  const { attendance, loading, error, doCheckIn, doCheckOut } = useAttendance();
  const { employees } = useEmployees();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [action, setAction] = useState("CHECK_IN");
  const navigate = useNavigate();

  const filteredLogs = attendance.filter((a) => {
    const empName = a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : "";
    return empName.toLowerCase().includes(search.toLowerCase()) ||
      a.status.toLowerCase().includes(search.toLowerCase());
  });

  const myLogs = isHRManager ? filteredLogs.filter(a => a.employeeId === user.employeeId) : [];
  const displayLogs = isHRManager ? filteredLogs.filter(a => a.employeeId !== user.employeeId) : filteredLogs;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
  const formatTime = (dateStr) => dateStr ? new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const empId = isEmployee ? employees[0]?.id : selectedEmployeeId;
    
    if (!empId) {
      toast.error(isEmployee ? "Employee record not found" : "Please select an employee");
      return;
    }
    let res;
    if (action === "CHECK_IN") {
      res = await doCheckIn(empId);
    } else {
      res = await doCheckOut(empId);
    }
    if (res.success) {
      toast.success(`${action === "CHECK_IN" ? "Check-in" : "Check-out"} recorded successfully`);
      setIsModalOpen(false);
    } else {
      toast.error(res.error || "Operation failed");
    }
  };

  const handleDirectAction = async (actionType) => {
    let res;
    if (actionType === "CHECK_IN") {
      res = await doCheckIn();
    } else {
      res = await doCheckOut();
    }
    if (res.success) {
      toast.success(`${actionType === "CHECK_IN" ? "Check-in" : "Check-out"} recorded successfully`);
    } else {
      toast.error(res.error || "Operation failed");
    }
  };

  const renderTable = (logs) => (
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
          {logs.map((att) => (
            <tr
              key={att.id}
              className="hover:bg-slate-800/40 transition-colors"
            >
              <td className="py-3.5 px-4 font-mono font-medium text-slate-200">{formatDate(att.checkIn)}</td>
              <td className="py-3.5 px-4 font-semibold text-white">
                {att.employee ? `${att.employee.firstName} ${att.employee.lastName}` : "Unknown"}
              </td>
              <td className="py-3.5 px-4 font-mono text-emerald-400">{formatTime(att.checkIn)}</td>
              <td className="py-3.5 px-4 font-mono text-amber-400">{formatTime(att.checkOut)}</td>
              <td className="py-3.5 px-4 font-bold text-white">{Number(att.workedHours).toFixed(1)} hrs</td>
              <td className="py-3.5 px-4">
                <StatusBadge status={att.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MockRbacNotice moduleKey="attendance" moduleName="Attendance Logs" />

      <PageHeader
        title="Attendance Logs"
        subtitle="Track workforce check-ins, check-outs, worked hours, and overtime"
        searchQuery={search}
        onSearchChange={setSearch}
        actionLabel={(!isEmployee && !isHRManager) ? "Record Attendance" : undefined}
        onActionClick={(!isEmployee && !isHRManager) ? () => setIsModalOpen(true) : undefined}
      >
        {isEmployee && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleDirectAction("CHECK_IN")}
              className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50 text-xs h-9 px-3.5 shadow-md flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Check In</span>
            </Button>
            <Button
              onClick={() => handleDirectAction("CHECK_OUT")}
              className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/50 text-xs h-9 px-3.5 shadow-md flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Check Out</span>
            </Button>
          </div>
        )}
      </PageHeader>

      {isHRManager && (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl mb-6">
          <h2 className="text-base font-bold text-white tracking-tight border-b border-[#1E293B] pb-3 mb-4">
            My Personal Attendance
          </h2>
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-emerald-400 mb-1">Start Work</h3>
                <p className="text-xs text-emerald-500/70">Record your daily check-in time</p>
              </div>
              <Button
                onClick={() => handleDirectAction("CHECK_IN")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md flex items-center gap-2 px-6"
              >
                <LogIn className="w-4 h-4" /> Check In
              </Button>
            </div>
            <div className="flex-1 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-amber-400 mb-1">End Work</h3>
                <p className="text-xs text-amber-500/70">Record your daily check-out time</p>
              </div>
              <Button
                onClick={() => handleDirectAction("CHECK_OUT")}
                className="bg-amber-500 hover:bg-amber-600 text-white shadow-md flex items-center gap-2 px-6"
              >
                <LogOut className="w-4 h-4" /> Check Out
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">My Recent Logs</h3>
            {myLogs.length > 0 ? renderTable(myLogs) : <div className="text-slate-400 text-sm">No personal attendance records found.</div>}
          </div>
        </div>
      )}

      {isHRManager && (
        <h2 className="text-lg font-bold text-white mt-8 mb-4">All Employees Attendance</h2>
      )}

      {loading ? (
        <div className="text-white p-6">Loading attendance records...</div>
      ) : error ? (
        <div className="text-rose-400 p-6">Error: {error}</div>
      ) : displayLogs.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No attendance records found"
          description="Record check-ins or manual attendance overrides."
          actionLabel="Record Attendance"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        renderTable(displayLogs)
      )}

      {/* Check In/Out Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-lg font-bold text-white">Record Attendance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isEmployee && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Select Employee *</label>
                  <select
                    required
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.employeeCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Action *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAction("CHECK_IN")}
                    className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      action === "CHECK_IN"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-[#020817] border-[#1E293B] text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <LogIn className="w-4 h-4" /> Check In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction("CHECK_OUT")}
                    className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      action === "CHECK_OUT"
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                        : "bg-[#020817] border-[#1E293B] text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <LogOut className="w-4 h-4" /> Check Out
                  </button>
                </div>
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
                  <span>Record</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
