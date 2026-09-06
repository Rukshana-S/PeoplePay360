export const ROLES = {
  ADMIN: "ADMIN",
  HR_MANAGER: "HR_MANAGER",
  HR_PAYROLL_MANAGER: "HR_PAYROLL_MANAGER",
  HR_PAYROLL_USER: "HR_PAYROLL_USER",
  EMPLOYEE: "EMPLOYEE",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.HR_MANAGER]: "HR Manager",
  [ROLES.HR_PAYROLL_MANAGER]: "HR Payroll Manager",
  [ROLES.HR_PAYROLL_USER]: "HR Payroll User",
  [ROLES.EMPLOYEE]: "Employee",
};

export const ROLE_BADGE_CLASSES = {
  [ROLES.ADMIN]: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  [ROLES.HR_MANAGER]: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  [ROLES.HR_PAYROLL_MANAGER]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  [ROLES.HR_PAYROLL_USER]: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  [ROLES.EMPLOYEE]: "bg-slate-500/10 text-slate-300 border-slate-500/30",
};

// Complete CRUD Matrix by Module and Role
export const ROLE_CRUD_MATRIX = {
  dashboard: {
    [ROLES.EMPLOYEE]: "OWN",
    [ROLES.HR_MANAGER]: "HR",
    [ROLES.HR_PAYROLL_USER]: "PAYROLL",
    [ROLES.HR_PAYROLL_MANAGER]: "PAYROLL",
    [ROLES.ADMIN]: "FULL",
  },
  employees: {
    [ROLES.EMPLOYEE]: "NONE",
    [ROLES.HR_MANAGER]: "CRUD",
    [ROLES.HR_PAYROLL_USER]: "CRUD",
    [ROLES.HR_PAYROLL_MANAGER]: "CRUD",
    [ROLES.ADMIN]: "CRUD",
  },
  contracts: {
    [ROLES.EMPLOYEE]: "VIEW_OWN",
    [ROLES.HR_MANAGER]: "CRUD",
    [ROLES.HR_PAYROLL_USER]: "CRUD",
    [ROLES.HR_PAYROLL_MANAGER]: "CRUD",
    [ROLES.ADMIN]: "CRUD",
  },
  schedules: {
    [ROLES.EMPLOYEE]: "VIEW_OWN",
    [ROLES.HR_MANAGER]: "CRUD",
    [ROLES.HR_PAYROLL_USER]: "CRUD",
    [ROLES.HR_PAYROLL_MANAGER]: "CRUD",
    [ROLES.ADMIN]: "CRUD",
  },
  attendance: {
    [ROLES.EMPLOYEE]: "VIEW_OWN_CLOCK",
    [ROLES.HR_MANAGER]: "CRUD",
    [ROLES.HR_PAYROLL_USER]: "CRUD",
    [ROLES.HR_PAYROLL_MANAGER]: "CRUD",
    [ROLES.ADMIN]: "CRUD",
  },
  timeOffRequests: {
    [ROLES.EMPLOYEE]: "CREATE_VIEW_OWN",
    [ROLES.HR_MANAGER]: "CRUD",
    [ROLES.HR_PAYROLL_USER]: "CRUD",
    [ROLES.HR_PAYROLL_MANAGER]: "CRUD",
    [ROLES.ADMIN]: "CRUD",
  },
  timeOffApprovals: {
    [ROLES.EMPLOYEE]: "NONE",
    [ROLES.HR_MANAGER]: "APPROVE",
    [ROLES.HR_PAYROLL_USER]: "APPROVE",
    [ROLES.HR_PAYROLL_MANAGER]: "APPROVE",
    [ROLES.ADMIN]: "APPROVE",
  },
  leaveAllocations: {
    [ROLES.EMPLOYEE]: "VIEW_OWN",
    [ROLES.HR_MANAGER]: "CRUD",
    [ROLES.HR_PAYROLL_USER]: "CRUD",
    [ROLES.HR_PAYROLL_MANAGER]: "CRUD",
    [ROLES.ADMIN]: "CRUD",
  },
  salaryStructures: {
    [ROLES.EMPLOYEE]: "NONE",
    [ROLES.HR_MANAGER]: "NONE",
    [ROLES.HR_PAYROLL_USER]: "VIEW",
    [ROLES.HR_PAYROLL_MANAGER]: "CRUD",
    [ROLES.ADMIN]: "CRUD",
  },
  salaryRules: {
    [ROLES.EMPLOYEE]: "NONE",
    [ROLES.HR_MANAGER]: "NONE",
    [ROLES.HR_PAYROLL_USER]: "VIEW",
    [ROLES.HR_PAYROLL_MANAGER]: "CRUD",
    [ROLES.ADMIN]: "CRUD",
  },
  payruns: {
    [ROLES.EMPLOYEE]: "NONE",
    [ROLES.HR_MANAGER]: "NONE",
    [ROLES.HR_PAYROLL_USER]: "CREATE_UPDATE",
    [ROLES.HR_PAYROLL_MANAGER]: "CRUD",
    [ROLES.ADMIN]: "CRUD",
  },
  payslips: {
    [ROLES.EMPLOYEE]: "VIEW_OWN",
    [ROLES.HR_MANAGER]: "NONE",
    [ROLES.HR_PAYROLL_USER]: "CREATE_UPDATE",
    [ROLES.HR_PAYROLL_MANAGER]: "CRUD",
    [ROLES.ADMIN]: "CRUD",
  },
  reports: {
    [ROLES.EMPLOYEE]: "OWN_ONLY",
    [ROLES.HR_MANAGER]: "HR_REPORTS",
    [ROLES.HR_PAYROLL_USER]: "PAYROLL_REPORTS",
    [ROLES.HR_PAYROLL_MANAGER]: "ALL_PAYROLL_REPORTS",
    [ROLES.ADMIN]: "ALL_REPORTS",
  },
  users: {
    [ROLES.EMPLOYEE]: "NONE",
    [ROLES.HR_MANAGER]: "NONE",
    [ROLES.HR_PAYROLL_USER]: "NONE",
    [ROLES.HR_PAYROLL_MANAGER]: "NONE",
    [ROLES.ADMIN]: "CRUD",
  },
};

export function getRoleDisplayName(role) {
  return ROLE_LABELS[role] || role || "User";
}

export function getRoleBadgeClass(role) {
  return ROLE_BADGE_CLASSES[role] || "bg-slate-500/10 text-slate-300 border-slate-500/30";
}

export function getModuleAccess(role, moduleKey) {
  if (!role || !ROLE_CRUD_MATRIX[moduleKey]) return "NONE";
  return ROLE_CRUD_MATRIX[moduleKey][role] || "NONE";
}

export function canAccessModule(role, moduleKey) {
  const access = getModuleAccess(role, moduleKey);
  return access !== "NONE";
}

export function canEditModule(role, moduleKey) {
  const access = getModuleAccess(role, moduleKey);
  return ["CRUD", "CREATE_UPDATE", "CREATE_VIEW_OWN"].includes(access);
}
