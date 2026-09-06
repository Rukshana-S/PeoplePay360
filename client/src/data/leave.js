export const INITIAL_LEAVE_TYPES = [
  {
    id: "lt-1",
    name: "Annual Leave",
    code: "AL",
    unit: "Days",
    requiresApproval: true,
    requiresAllocation: true,
    payrollAffects: "Paid",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  },
  {
    id: "lt-2",
    name: "Sick Leave",
    code: "SL",
    unit: "Days",
    requiresApproval: true,
    requiresAllocation: true,
    payrollAffects: "Paid",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30"
  },
  {
    id: "lt-3",
    name: "Casual Leave",
    code: "CL",
    unit: "Days",
    requiresApproval: true,
    requiresAllocation: true,
    payrollAffects: "Paid",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30"
  },
  {
    id: "lt-4",
    name: "Unpaid Leave",
    code: "UL",
    unit: "Days",
    requiresApproval: true,
    requiresAllocation: false,
    payrollAffects: "Deduction",
    color: "text-[#5B8DEF] bg-[#5B8DEF]/10 border-[#5B8DEF]/30"
  }
];

export const INITIAL_LEAVE_REQUESTS = [
  {
    id: "tor-101",
    employeeId: "emp-5",
    employeeName: "Ethan Bennett",
    leaveType: "Annual Leave",
    startDate: "2026-09-10",
    endDate: "2026-09-14",
    duration: 5,
    reason: "Family vacation & medical checkup",
    status: "Pending",
    submittedOn: "2026-09-02"
  },
  {
    id: "tor-102",
    employeeId: "emp-6",
    employeeName: "Sarah Jenkins",
    leaveType: "Sick Leave",
    startDate: "2026-08-20",
    endDate: "2026-08-21",
    duration: 2,
    reason: "Flu and fever recovery",
    status: "Approved",
    submittedOn: "2026-08-19"
  },
  {
    id: "tor-103",
    employeeId: "emp-9",
    employeeName: "James Wilson",
    leaveType: "Casual Leave",
    startDate: "2026-09-01",
    endDate: "2026-09-03",
    duration: 3,
    reason: "Personal urgent matters",
    status: "Approved",
    submittedOn: "2026-08-28"
  },
  {
    id: "tor-104",
    employeeId: "emp-4",
    employeeName: "Paula User",
    leaveType: "Annual Leave",
    startDate: "2026-10-01",
    endDate: "2026-10-10",
    duration: 8,
    reason: "Autumn holiday trip",
    status: "Rejected",
    submittedOn: "2026-08-25"
  }
];

export const INITIAL_LEAVE_ALLOCATIONS = [
  {
    id: "alloc-1",
    employeeId: "emp-1",
    employeeName: "Alex Administrator",
    leaveType: "Annual Leave",
    allocated: 25,
    taken: 5,
    remaining: 20,
    validity: "2026-12-31"
  },
  {
    id: "alloc-2",
    employeeId: "emp-2",
    employeeName: "Hannah Rice",
    leaveType: "Annual Leave",
    allocated: 22,
    taken: 4,
    remaining: 18,
    validity: "2026-12-31"
  },
  {
    id: "alloc-3",
    employeeId: "emp-5",
    employeeName: "Ethan Bennett",
    leaveType: "Annual Leave",
    allocated: 20,
    taken: 8,
    remaining: 12,
    validity: "2026-12-31"
  },
  {
    id: "alloc-4",
    employeeId: "emp-5",
    employeeName: "Ethan Bennett",
    leaveType: "Sick Leave",
    allocated: 10,
    taken: 2,
    remaining: 8,
    validity: "2026-12-31"
  },
  {
    id: "alloc-5",
    employeeId: "emp-6",
    employeeName: "Sarah Jenkins",
    leaveType: "Annual Leave",
    allocated: 20,
    taken: 6,
    remaining: 14,
    validity: "2026-12-31"
  }
];
