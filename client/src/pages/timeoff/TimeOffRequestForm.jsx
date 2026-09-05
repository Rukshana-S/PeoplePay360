import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TIME_OFF_REQUESTS } from "../../data/timeOff";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import MockRbacNotice from "../../components/common/MockRbacNotice";
import { Clock, User, Calendar, Check, X, FileText } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

const TimeOffRequestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const reqData = TIME_OFF_REQUESTS.find((r) => r.id === id) || TIME_OFF_REQUESTS[0];
  const [status, setStatus] = useState(reqData.status);

  const handleApprove = () => {
    setStatus("Approved");
    toast.success(`Leave request for ${reqData.employeeName} approved!`);
  };

  const handleReject = () => {
    setStatus("Rejected");
    toast.error(`Leave request for ${reqData.employeeName} rejected.`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <MockRbacNotice moduleKey="timeOffRequests" moduleName="Leave Application Form" />

      <PageHeader
        title={`Leave Request: ${reqData.employeeName}`}
        subtitle={`Submitted on ${reqData.submittedOn}`}
        showBack
        backPath="/time-off/requests"
      />

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{reqData.leaveType}</h2>
              <p className="text-xs text-slate-400">Duration: <span className="text-emerald-400 font-semibold">{reqData.duration}</span></p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Employee</label>
            <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#5B8DEF]" />
              <span className="font-semibold">{reqData.employeeName}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">Start Date</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2 font-mono">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{reqData.startDate}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase">End Date</label>
              <div className="mt-1 p-2.5 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-white flex items-center gap-2 font-mono">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{reqData.endDate}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase">Reason / Justification</label>
            <div className="mt-1 p-3 bg-[#020817] border border-[#1E293B] rounded-lg text-xs text-slate-300 flex items-start gap-2">
              <FileText className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <span>{reqData.reason}</span>
            </div>
          </div>
        </div>

        {/* Approval Action Buttons */}
        <div className="pt-4 border-t border-[#1E293B] flex items-center justify-end gap-3">
          <Button
            type="button"
            onClick={handleReject}
            disabled={status === "Rejected"}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-semibold px-4 h-10 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
          >
            <X className="w-4 h-4" /> Reject Request
          </Button>

          <Button
            type="button"
            onClick={handleApprove}
            disabled={status === "Approved"}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 h-10 rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Approve Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimeOffRequestForm;
