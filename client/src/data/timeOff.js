export const TIME_OFF_TYPES = [
  {
    id: "tot-1",
    name: "Annual Leave",
    code: "AL",
    unit: "Days",
    requiresAllocation: true,
    payrollAffects: "Paid",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  },
  {
    id: "tot-2",
    name: "Sick Leave",
    code: "SL",
    unit: "Days",
    requiresAllocation: true,
    payrollAffects: "Paid",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30"
  },
  {
    id: "tot-3",
    name: "Casual Leave",
    code: "CL",
    unit: "Days",
    requiresAllocation: true,
    payrollAffects: "Paid",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30"
  },
  {
    id: "tot-4",
    name: "Unpaid Leave",
    code: "UL",
    unit: "Days",
    requiresAllocation: false,
    payrollAffects: "Unpaid (Deduction)",
    color: "text-[#5B8DEF] bg-[#5B8DEF]/10 border-[#5B8DEF]/30"
  }
];

export const TIME_OFF_REQUESTS = [
  {
    id: "tor-101",
    employeeId: "emp-5",
    employeeName: "Ethan Bennett",
    leaveType: "Annual Leave",
    startDate: "2026-09-10",
    endDate: "2026-09-14",
    duration: "5 Days",
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
    duration: "2 Days",
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
    duration: "3 Days",
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
    duration: "8 Days",
    reason: "Autumn holiday trip",
    status: "Rejected",
    submittedOn: "2026-08-25"
  }
];

export const LEAVE_ALLOCATIONS = [
  {
    id: "alloc-1",
    employeeId: "emp-1",
    employeeName: "Alex Administrator",
    leaveType: "Annual Leave",
    allocated: 25,
    taken: 5,
    remaining: 20
  },
  {
    id: "alloc-2",
    employeeId: "emp-2",
    employeeName: "Hannah Rice",
    leaveType: "Annual Leave",
    allocated: 22,
    taken: 4,
    remaining: 18
  },
  {
    id: "alloc-3",
    employeeId: "emp-5",
    employeeName: "Ethan Bennett",
    leaveType: "Annual Leave",
    allocated: 20,
    taken: 8,
    remaining: 12
  },
  {
    id: "alloc-4",
    employeeId: "emp-5",
    employeeName: "Ethan Bennett",
    leaveType: "Sick Leave",
    allocated: 10,
    taken: 2,
    remaining: 8
  },
  {
    id: "alloc-5",
    employeeId: "emp-6",
    employeeName: "Sarah Jenkins",
    leaveType: "Annual Leave",
    allocated: 20,
    taken: 6,
    remaining: 14
  }
];
