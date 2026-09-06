export const INITIAL_PAYRUNS = [
  {
    id: "pr-101",
    name: "September 2026 Monthly Payroll",
    structureName: "Regular Salary Structure",
    period: "Sep 01, 2026 - Sep 30, 2026",
    employeesCount: 6,
    totalGross: 68500,
    totalNet: 61850,
    status: "Validated"
  },
  {
    id: "pr-102",
    name: "August 2026 Monthly Payroll",
    structureName: "Regular Salary Structure",
    period: "Aug 01, 2026 - Aug 31, 2026",
    employeesCount: 6,
    totalGross: 68500,
    totalNet: 61850,
    status: "Paid"
  },
  {
    id: "pr-103",
    name: "Q3 Intern Stipend Batch",
    structureName: "Intern Salary Structure",
    period: "Sep 01, 2026 - Sep 30, 2026",
    employeesCount: 1,
    totalGross: 23000,
    totalNet: 23000,
    status: "Draft"
  }
];

export const INITIAL_PAYSLIPS = [
  {
    id: "ps-201",
    payrunId: "pr-101",
    employeeId: "emp-1",
    employeeName: "Alex Administrator",
    period: "September 2026",
    structureName: "Regular Salary Structure",
    annualWage: 120000,
    basic: 5000,
    gross: 11500,
    net: 10450,
    status: "Validated"
  },
  {
    id: "ps-202",
    payrunId: "pr-101",
    employeeId: "emp-2",
    employeeName: "Hannah Rice",
    period: "September 2026",
    structureName: "Regular Salary Structure",
    annualWage: 95000,
    basic: 3958,
    gross: 9400,
    net: 8520,
    status: "Validated"
  },
  {
    id: "ps-203",
    payrunId: "pr-101",
    employeeId: "emp-5",
    employeeName: "Ethan Bennett",
    period: "September 2026",
    structureName: "Regular Salary Structure",
    annualWage: 110000,
    basic: 4583,
    gross: 10600,
    net: 9620,
    status: "Validated"
  },
  {
    id: "ps-204",
    payrunId: "pr-103",
    employeeId: "emp-7",
    employeeName: "David Miller",
    period: "September 2026",
    structureName: "Intern Salary Structure",
    annualWage: 35000,
    basic: 20000,
    gross: 23000,
    net: 23000,
    status: "Draft"
  },
  {
    id: "ps-205",
    payrunId: "pr-101",
    employeeId: "emp-8",
    employeeName: "Lisa Wang",
    period: "September 2026",
    structureName: "Contractor Salary Structure",
    annualWage: 65000,
    basic: 5417,
    gross: 10417,
    net: 9375,
    status: "Validated"
  }
];
