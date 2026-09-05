export const SALARY_STRUCTURES = [
  {
    id: "struct-1",
    name: "Regular Salary Structure",
    code: "REG-2026",
    type: "Full Time Employees",
    rulesCount: 11,
    description: "Standard corporate salary structure with allowances (HRA, LTA, Bonus) and statutory deductions (PF, ESIC, PT, LWF)."
  },
  {
    id: "struct-2",
    name: "Intern Salary Structure",
    code: "INT-2026",
    type: "Interns & Trainees",
    rulesCount: 3,
    description: "Simplified stipend structure with fixed allowance and zero statutory tax deductions."
  },
  {
    id: "struct-3",
    name: "Contractor Salary Structure",
    code: "CON-2026",
    type: "Independent Contractors",
    rulesCount: 3,
    description: "Professional fee structure with 10% Tax Deducted at Source (TDS)."
  }
];

export const SALARY_RULES = [
  // Regular Structure Rules
  { id: "rule-101", structureId: "struct-1", name: "Basic Salary", code: "BASIC", category: "BASIC", sequence: 1, formula: "Wage / 12", type: "Allowance" },
  { id: "rule-102", structureId: "struct-1", name: "House Rent Allowance", code: "HRA", category: "ALW", sequence: 2, formula: "20% of BASIC", type: "Allowance" },
  { id: "rule-103", structureId: "struct-1", name: "Standard Allowance", code: "STD", category: "ALW", sequence: 3, formula: "Fixed ₹2,000", type: "Allowance" },
  { id: "rule-104", structureId: "struct-1", name: "Performance Bonus", code: "BONUS", category: "ALW", sequence: 4, formula: "Fixed ₹3,000", type: "Allowance" },
  { id: "rule-105", structureId: "struct-1", name: "Leave Travel Allowance", code: "LTA", category: "ALW", sequence: 5, formula: "Fixed ₹1,500", type: "Allowance" },
  { id: "rule-106", structureId: "struct-1", name: "Fixed Special Allowance", code: "FIXED", category: "ALW", sequence: 6, formula: "Fixed ₹1,000", type: "Allowance" },
  { id: "rule-107", structureId: "struct-1", name: "Gross Salary", code: "GROSS", category: "GROSS", sequence: 7, formula: "BASIC + HRA + STD + BONUS + LTA + FIXED", type: "Header" },
  { id: "rule-108", structureId: "struct-1", name: "Provident Fund", code: "PF", category: "DED", sequence: 8, formula: "12% of BASIC", type: "Deduction" },
  { id: "rule-109", structureId: "struct-1", name: "ESIC Contribution", code: "ESIC", category: "DED", sequence: 9, formula: "0.75% of GROSS", type: "Deduction" },
  { id: "rule-110", structureId: "struct-1", name: "Professional Tax", code: "PT", category: "DED", sequence: 10, formula: "Fixed ₹200", type: "Deduction" },
  { id: "rule-111", structureId: "struct-1", name: "Labor Welfare Fund", code: "LWF", category: "DED", sequence: 11, formula: "Fixed ₹50", type: "Deduction" },

  // Intern Rules
  { id: "rule-201", structureId: "struct-2", name: "Basic Stipend", code: "STIPEND", category: "BASIC", sequence: 1, formula: "Wage / 12", type: "Allowance" },
  { id: "rule-202", structureId: "struct-2", name: "Intern Special Allowance", code: "INT_ALW", category: "ALW", sequence: 2, formula: "Fixed ₹1,000", type: "Allowance" },
  { id: "rule-203", structureId: "struct-2", name: "Gross Stipend", code: "GROSS", category: "GROSS", sequence: 3, formula: "STIPEND + INT_ALW", type: "Header" },

  // Contractor Rules
  { id: "rule-301", structureId: "struct-3", name: "Contract Amount", code: "CONTRACT_AMT", category: "BASIC", sequence: 1, formula: "Wage / 12", type: "Allowance" },
  { id: "rule-302", structureId: "struct-3", name: "TDS Deduction", code: "TDS", category: "DED", sequence: 2, formula: "10% of CONTRACT_AMT", type: "Deduction" },
  { id: "rule-303", structureId: "struct-3", name: "Net Professional Fee", code: "NET", category: "NET", sequence: 3, formula: "CONTRACT_AMT - TDS", type: "Header" },
];

export const PAYRUNS = [
  {
    id: "pr-101",
    name: "September 2026 Monthly Payroll",
    structureName: "Regular Salary Structure",
    period: "Sep 01, 2026 - Sep 30, 2026",
    employeesCount: 6,
    totalGross: 62400,
    totalNet: 53120,
    status: "Validated"
  },
  {
    id: "pr-102",
    name: "August 2026 Monthly Payroll",
    structureName: "Regular Salary Structure",
    period: "Aug 01, 2026 - Aug 31, 2026",
    employeesCount: 6,
    totalGross: 62400,
    totalNet: 53120,
    status: "Paid"
  },
  {
    id: "pr-103",
    name: "Q3 Intern Stipend Batch",
    structureName: "Intern Salary Structure",
    period: "Sep 01, 2026 - Sep 30, 2026",
    employeesCount: 1,
    totalGross: 3916,
    totalNet: 3916,
    status: "Draft"
  }
];

export const PAYSLIPS = [
  {
    id: "ps-201",
    payrunId: "pr-101",
    employeeId: "emp-1",
    employeeName: "Alex Administrator",
    period: "September 2026",
    structureName: "Regular Salary Structure",
    annualWage: 120000,
    basic: 10000,
    gross: 19500,
    net: 17853.75,
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
    basic: 7916.67,
    gross: 15000,
    net: 13697.50,
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
    basic: 9166.67,
    gross: 17500,
    net: 16008.42,
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
    basic: 2916.67,
    gross: 3916.67,
    net: 3916.67,
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
    basic: 5416.67,
    gross: 5416.67,
    net: 4875.00,
    status: "Validated"
  }
];

export function calculatePayslipBreakdown(annualWage, structureName = "Regular Salary Structure") {
  const monthlyBasic = Math.round((annualWage / 12) * 100) / 100;

  if (structureName.includes("Intern")) {
    const allowance = 1000;
    const gross = monthlyBasic + allowance;
    return {
      structureName: "Intern Salary Structure",
      lines: [
        { code: "STIPEND", name: "Basic Stipend", category: "BASIC", amount: monthlyBasic },
        { code: "INT_ALW", name: "Intern Allowance", category: "ALW", amount: allowance },
        { code: "GROSS", name: "Gross Stipend", category: "GROSS", amount: gross },
        { code: "NET", name: "Net Payable Stipend", category: "NET", amount: gross }
      ],
      gross,
      totalDeductions: 0,
      net: gross
    };
  }

  if (structureName.includes("Contractor")) {
    const gross = monthlyBasic;
    const tds = Math.round(gross * 0.10 * 100) / 100;
    const net = gross - tds;
    return {
      structureName: "Contractor Salary Structure",
      lines: [
        { code: "CONTRACT_AMT", name: "Contract Amount", category: "BASIC", amount: gross },
        { code: "TDS", name: "TDS Deduction (10%)", category: "DED", amount: tds },
        { code: "NET", name: "Net Professional Fee", category: "NET", amount: net }
      ],
      gross,
      totalDeductions: tds,
      net
    };
  }

  // Regular Salary Breakdown
  const hra = Math.round(monthlyBasic * 0.20 * 100) / 100;
  const standard = 2000;
  const bonus = 3000;
  const lta = 1500;
  const fixed = 1000;
  const gross = monthlyBasic + hra + standard + bonus + lta + fixed;

  const pf = Math.round(monthlyBasic * 0.12 * 100) / 100;
  const esic = Math.round(gross * 0.0075 * 100) / 100;
  const pt = 200;
  const lwf = 50;
  const totalDeductions = pf + esic + pt + lwf;
  const net = Math.round((gross - totalDeductions) * 100) / 100;

  return {
    structureName: "Regular Salary Structure",
    lines: [
      { code: "BASIC", name: "Basic Salary", category: "BASIC", amount: monthlyBasic },
      { code: "HRA", name: "House Rent Allowance (20%)", category: "ALW", amount: hra },
      { code: "STD", name: "Standard Allowance", category: "ALW", amount: standard },
      { code: "BONUS", name: "Performance Bonus", category: "ALW", amount: bonus },
      { code: "LTA", name: "Leave Travel Allowance", category: "ALW", amount: lta },
      { code: "FIXED", name: "Fixed Special Allowance", category: "ALW", amount: fixed },
      { code: "GROSS", name: "Gross Salary", category: "GROSS", amount: gross },
      { code: "PF", name: "Provident Fund (12%)", category: "DED", amount: pf },
      { code: "ESIC", name: "ESIC Contribution (0.75%)", category: "DED", amount: esic },
      { code: "PT", name: "Professional Tax", category: "DED", amount: pt },
      { code: "LWF", name: "Labor Welfare Fund", category: "DED", amount: lwf },
      { code: "NET", name: "Net Salary Payable", category: "NET", amount: net }
    ],
    gross,
    totalDeductions,
    net
  };
}
