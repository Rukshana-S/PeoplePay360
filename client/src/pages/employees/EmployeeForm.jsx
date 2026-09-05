import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EMPLOYEES } from "../../data/employees";
import PageHeader from "../../components/common/PageHeader";
import SmartButtons from "../../components/common/SmartButtons";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { Mail, Phone, Building2, Briefcase, User, Calendar, MapPin, Shield, CreditCard, Home } from "lucide-react";
import { toast } from "react-toastify";

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("work");

  // Find employee or fallback to first employee
  const employee = EMPLOYEES.find((e) => e.id === id) || EMPLOYEES[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <MockRbacNotice moduleKey="employees" moduleName={`Employee Details (${employee.name})`} />

      <PageHeader
        title={`Employee: ${employee.name}`}
        subtitle={`Central Profile Hub • ${employee.employeeCode}`}
        showBack
        backPath="/employees"
      >
        <SmartButtons
          employeeId={employee.id}
          contractsCount={1}
          attendanceCount={8}
          timeOffCount={2}
        />
      </PageHeader>

      {/* Main Employee Card Header */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5B8DEF] to-indigo-600 border-2 border-[#5B8DEF]/40 flex items-center justify-center font-bold text-white text-2xl uppercase shadow-lg shadow-[#5B8DEF]/20 shrink-0">
              {employee.avatar}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">{employee.name}</h1>
                <StatusBadge status={employee.status} />
              </div>
              <p className="text-sm font-semibold text-[#5B8DEF]">{employee.jobPosition}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-500" /> {employee.department}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /> {employee.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" /> {employee.phone}</span>
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
                  <span>{employee.department}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Manager</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>{employee.manager}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Working Schedule</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{employee.schedule}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Job Position</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>{employee.jobPosition}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Work Location</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{employee.workLocation}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Company</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span>{employee.company}</span>
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
                  <span>{employee.privateInfo?.address || "Address not provided"}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Bank Account Number</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono">{employee.privateInfo?.bankAccount || "US981273981237"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Emergency Contact</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{employee.privateInfo?.emergencyContact || "Contact on file"}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Nationality & Gender</label>
                <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>{employee.privateInfo?.nationality || "American"} • {employee.privateInfo?.gender || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeForm;
