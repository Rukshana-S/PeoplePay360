import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../../hooks/useEmployees";
import PageHeader from "../../components/common/PageHeader";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import FormActions from "../../components/shared/FormActions";
import { toast } from "react-toastify";
import * as api from "../../api/axios";

const AttendanceCreate = () => {
  const navigate = useNavigate();
  const { employees, loading } = useEmployees();

  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("PRESENT");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) {
      toast.error("Please select an employee");
      return;
    }
    
    try {
      // Use raw axios call since we don't have a manual add endpoint defined in attendance.js
      await api.default.post('/attendance', {
        employeeId,
        date,
        checkIn: checkIn ? new Date(`${date}T${checkIn}`).toISOString() : null,
        checkOut: checkOut ? new Date(`${date}T${checkOut}`).toISOString() : null,
        status,
      });
      toast.success("Attendance record created");
      navigate("/attendance");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create record");
    }
  };

  if (loading) return <div className="p-6 text-white">Loading employees...</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <MockRbacNotice moduleKey="attendance" moduleName="Record Attendance" />

      <PageHeader
        title="Record Attendance Log"
        subtitle="Manually add check-in/out record or attendance override for employee"
        showBack
        backPath="/attendance"
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Select Employee *</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
            >
              <option value="">Select an Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeCode}) - {emp.department}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Attendance Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white focus:border-[#5B8DEF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Attendance Status *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Check In Time</label>
              <input
                type="time"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-emerald-400 font-mono focus:border-[#5B8DEF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Check Out Time</label>
              <input
                type="time"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-amber-400 font-mono focus:border-[#5B8DEF] focus:outline-none"
              />
            </div>
          </div>

          <FormActions
            onCancel={() => navigate("/attendance")}
            submitLabel="Save Attendance Record"
          />
        </form>
      </div>
    </div>
  );
};

export default AttendanceCreate;
