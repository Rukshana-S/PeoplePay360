import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import SmartButton from "../../components/shared/SmartButton";
import StatusBadge from "../../components/shared/StatusBadge";
import ConfirmDeleteDialog from "../../components/shared/ConfirmDeleteDialog";
import { Mail, Phone, Building2, Briefcase, User, Calendar, MapPin, Shield, CreditCard, Home, FileText, CalendarCheck, Clock, Edit3, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useEmployees } from "../../hooks/useEmployees";
import * as api from "../../api/employees";
import { toast } from "react-toastify";

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("work");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await api.getEmployeeById(id);
        setEmployee(res.data || res);
      } catch (err) {
        toast.error("Failed to load employee details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmp();
  }, [id]);

  const { removeEmployee } = useEmployees();

  const handleDeleteConfirm = async () => {
    try {
      const res = await removeEmployee(id);
      if (res.success) {
        setIsDeleteOpen(false);
        toast.success("Employee deleted successfully");
        navigate("/employees");
      } else {
        toast.error(res.error || "Failed to delete employee");
      }
    } catch (err) {
      toast.error("Failed to delete employee");
    }
  };

  if (loading) {
    return <div className="text-white p-6">Loading employee profile...</div>;
  }

  if (!employee) {
    return <div className="text-white p-6">Employee not found.</div>;
  }

  const empContractsCount = employee._count?.contracts || 0;
  const empAttendanceCount = employee._count?.attendances || 0;
  const empTimeOffCount = employee._count?.timeOffRequests || 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title={`Employee: ${employee.firstName} ${employee.lastName}`}
        subtitle={`Central Profile Hub • Code: ${employee.employeeCode}`}
        showBack
        backPath="/employees"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/employees/${employee.id}/edit`)}
            className="border-[#1E293B] bg-[#0F172A] hover:bg-[#1E293B] text-slate-300 hover:text-white text-xs h-9"
          >
            <Edit3 className="w-4 h-4 mr-1.5 text-[#5B8DEF]" />
            Edit Profile
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsDeleteOpen(true)}
            className="border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs h-9"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>

          <div className="flex items-center gap-2 ml-2 border-l border-[#1E293B] pl-2">
            <SmartButton
              icon={FileText}
              label="Contracts"
              count={empContractsCount}
              onClick={() => navigate(`/employees/${employee.id}/contracts`)}
              color="text-purple-400"
            />
            <SmartButton
              icon={CalendarCheck}
              label="Attendance"
              count={empAttendanceCount}
              onClick={() => navigate(`/employees/${employee.id}/attendance`)}
              color="text-emerald-400"
            />
            <SmartButton
              icon={Clock}
              label="Time Off"
              count={empTimeOffCount}
              onClick={() => navigate(`/employees/${employee.id}/timeoff`)}
              color="text-amber-400"
            />
          </div>
        </div>
      </PageHeader>

      {/* Main Card Header */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5B8DEF] to-indigo-600 border-2 border-[#5B8DEF]/40 flex items-center justify-center font-bold text-white text-2xl uppercase shadow-lg shadow-[#5B8DEF]/20 shrink-0">
              {employee.firstName?.charAt(0) || "U"}{employee.lastName?.charAt(0) || ""}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">{employee.firstName || "Unknown"} {employee.lastName || ""}</h1>
                <StatusBadge status={employee.status} />
              </div>
              <p className="text-sm font-semibold text-[#5B8DEF]">{employee.jobPosition?.title || "-"}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-500" /> {employee.department?.name || "-"}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /> {employee.email || "No email"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-[#1E293B]">
          <button
            type="button"
            onClick={() => setActiveTab("work")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "work"
                ? "bg-[#5B8DEF] text-white shadow-md shadow-[#5B8DEF]/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Work Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("private")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "private"
                ? "bg-[#5B8DEF] text-white shadow-md shadow-[#5B8DEF]/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Private Information
          </button>
        </div>
      </div>

      {/* Tab Content Cards */}
      {activeTab === "work" ? (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white tracking-tight border-b border-[#1E293B] pb-3">
            Work Details & Organizational Assignment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Department</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#5B8DEF]" />
                  <span>{employee.department?.name || "-"}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Manager</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>{employee.manager ? `${employee.manager.firstName} ${employee.manager.lastName}` : "None"}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Working Schedule</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{employee.schedule?.name || "None"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Job Position</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>{employee.jobPosition?.title || "-"}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Work Location</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>HQ - San Francisco</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Company</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span>PeoplePay360 Inc.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white tracking-tight border-b border-[#1E293B] pb-3">
            Private & Confidential Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Home Address</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#5B8DEF]" />
                  <span>Address on file</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Bank Account Number</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono">US981273981237</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Emergency Contact</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Contact on file</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Nationality & Gender</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>American • Not specified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Employee "${employee.firstName} ${employee.lastName}"`}
        message="Are you sure you want to delete this employee master record? Associated contract and attendance data will be affected."
      />
    </div>
  );
};

export default EmployeeForm;
