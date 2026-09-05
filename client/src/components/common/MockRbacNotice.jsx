import React from "react";
import { useAuth } from "../../context/AuthContext";
import { getRoleDisplayName, getModuleAccess } from "../../utils/rolePermissions";
import { ShieldAlert, ShieldCheck, Lock } from "lucide-react";

const MockRbacNotice = ({ moduleKey, moduleName }) => {
  const { user } = useAuth();
  const role = user?.role || "EMPLOYEE";
  const access = getModuleAccess(role, moduleKey);

  const isFullAccess = ["CRUD", "FULL", "APPROVE", "CREATE_UPDATE"].includes(access);

  return (
    <div className="mb-4 p-3 rounded-xl bg-[#0F172A] border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg border shrink-0 ${
          isFullAccess
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
        }`}>
          {isFullAccess ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{moduleName || "Module"} Permission</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {access}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Role <span className="text-slate-200 font-medium">{getRoleDisplayName(role)}</span> is viewing this module under Mock RBAC demo rules.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <span className="px-2 py-0.5 rounded-full bg-[#5B8DEF]/10 border border-[#5B8DEF]/20 text-[#5B8DEF] font-mono text-[10px]">
          Demo Access Active
        </span>
      </div>
    </div>
  );
};

export default MockRbacNotice;
