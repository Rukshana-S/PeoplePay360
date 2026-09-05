export const INITIAL_SALARY_STRUCTURES = [
  {
    id: "struct-1",
    name: "Regular Salary Structure",
    code: "REG-2026",
    type: "Full Time Employees",
    active: true,
    employeesCount: 6,
    rulesCount: 12,
    description: "Standard corporate salary structure with 50% basic, HRA 20%, Standard ₹5,000, Bonus 10%, LTA ₹2,000, Fixed ₹1,500, and statutory deductions (PF 12%, ESIC 0.75%, PT ₹200, LWF ₹200)."
  },
  {
    id: "struct-2",
    name: "Intern Salary Structure",
    code: "INT-2026",
    type: "Interns & Trainees",
    active: true,
    employeesCount: 1,
    rulesCount: 5,
    description: "Stipend structure with ₹20,000 basic, ₹1,000 internet, ₹2,000 learning allowance, and zero statutory tax deductions."
  },
  {
    id: "struct-3",
    name: "Contractor Salary Structure",
    code: "CON-2026",
    type: "Independent Contractors",
    active: true,
    employeesCount: 1,
    rulesCount: 4,
    description: "Professional fee structure with Project Allowance ₹5,000 and 10% Tax Deducted at Source (TDS)."
  }
];

export const INITIAL_SALARY_RULES = [
  // Regular Salary Structure Rules
  { id: "rule-101", structureId: "struct-1", name: "Basic Salary", code: "BASIC", category: "BASIC", sequence: 1, formula: "50% of Wage", type: "Allowance" },
  { id: "rule-102", structureId: "struct-1", name: "House Rent Allowance", code: "HRA", category: "ALW", sequence: 2, formula: "20% of BASIC", type: "Allowance" },
  { id: "rule-103", structureId: "struct-1", name: "Standard Allowance", code: "STD", category: "ALW", sequence: 3, formula: "Fixed ₹5,000", type: "Allowance" },
  { id: "rule-104", structureId: "struct-1", name: "Performance Bonus", code: "BONUS", category: "ALW", sequence: 4, formula: "10% of BASIC", type: "Allowance" },
  { id: "rule-105", structureId: "struct-1", name: "Leave Travel Allowance", code: "LTA", category: "ALW", sequence: 5, formula: "Fixed ₹2,000", type: "Allowance" },
  { id: "rule-106", structureId: "struct-1", name: "Fixed Special Allowance", code: "FIXED", category: "ALW", sequence: 6, formula: "Fixed ₹1,500", type: "Allowance" },
  { id: "rule-107", structureId: "struct-1", name: "Gross Salary", code: "GROSS", category: "GROSS", sequence: 7, formula: "BASIC + HRA + STD + BONUS + LTA + FIXED", type: "Header" },
  { id: "rule-108", structureId: "struct-1", name: "Labor Welfare Fund", code: "LWF", category: "DED", sequence: 8, formula: "Fixed ₹200", type: "Deduction" },
  { id: "rule-109", structureId: "struct-1", name: "Provident Fund", code: "PF", category: "DED", sequence: 9, formula: "12% of BASIC", type: "Deduction" },
  { id: "rule-110", structureId: "struct-1", name: "ESIC Contribution", code: "ESIC", category: "DED", sequence: 10, formula: "0.75% of GROSS", type: "Deduction" },
  { id: "rule-111", structureId: "struct-1", name: "Professional Tax", code: "PT", category: "DED", sequence: 11, formula: "Fixed ₹200", type: "Deduction" },
  { id: "rule-112", structureId: "struct-1", name: "Net Salary", code: "NET", category: "NET", sequence: 12, formula: "GROSS - Deductions", type: "Header" },

  // Intern Salary Structure Rules
  { id: "rule-201", structureId: "struct-2", name: "Basic Stipend", code: "BASIC", category: "BASIC", sequence: 1, formula: "Fixed ₹20,000", type: "Allowance" },
  { id: "rule-202", structureId: "struct-2", name: "Internet Allowance", code: "INET", category: "ALW", sequence: 2, formula: "Fixed ₹1,000", type: "Allowance" },
  { id: "rule-203", structureId: "struct-2", name: "Learning Allowance", code: "LEARN", category: "ALW", sequence: 3, formula: "Fixed ₹2,000", type: "Allowance" },
  { id: "rule-204", structureId: "struct-2", name: "Gross Stipend", code: "GROSS", category: "GROSS", sequence: 4, formula: "BASIC + INET + LEARN", type: "Header" },
  { id: "rule-205", structureId: "struct-2", name: "Net Stipend", code: "NET", category: "NET", sequence: 5, formula: "GROSS (PF=0, ESIC=0, PT=0)", type: "Header" },

  // Contractor Salary Structure Rules
  { id: "rule-301", structureId: "struct-3", name: "Contract Professional Fee", code: "BASIC", category: "BASIC", sequence: 1, formula: "Contract Fixed Amount", type: "Allowance" },
  { id: "rule-302", structureId: "struct-3", name: "Project Allowance", code: "PROJ", category: "ALW", sequence: 2, formula: "Fixed ₹5,000", type: "Allowance" },
  { id: "rule-303", structureId: "struct-3", name: "Gross Fee", code: "GROSS", category: "GROSS", sequence: 3, formula: "BASIC + PROJ", type: "Header" },
  { id: "rule-304", structureId: "struct-3", name: "TDS Deduction (10%)", code: "TDS", category: "DED", sequence: 4, formula: "10% of GROSS", type: "Deduction" },
  { id: "rule-305", structureId: "struct-3", name: "Net Professional Fee", code: "NET", category: "NET", sequence: 5, formula: "GROSS - TDS", type: "Header" },
];

export function calculateSalaryBreakdown(wage, structureName = "Regular Salary Structure") {
  const monthlyWage = Math.round((wage || 120000) / 12);

  if (structureName && structureName.includes("Intern")) {
    const basic = 20000;
    const internet = 1000;
    const learning = 2000;
    const gross = basic + internet + learning;

    const lines = [
      { name: "Basic Stipend", code: "BASIC", category: "BASIC", amount: basic },
      { name: "Internet Allowance", code: "INET", category: "ALW", amount: internet },
      { name: "Learning Allowance", code: "LEARN", category: "ALW", amount: learning },
      { name: "Gross Stipend", code: "GROSS", category: "GROSS", amount: gross },
      { name: "Net Stipend", code: "NET", category: "NET", amount: gross },
    ];

    return {
      structureName: "Intern Salary Structure",
      earnings: [
        { code: "BASIC", name: "Basic Stipend", amount: basic },
        { code: "INET", name: "Internet Allowance", amount: internet },
        { code: "LEARN", name: "Learning Allowance", amount: learning },
      ],
      deductions: [],
      gross,
      totalDeductions: 0,
      net: gross,
      lines,
    };
  }

  if (structureName && structureName.includes("Contractor")) {
    const basic = monthlyWage;
    const project = 5000;
    const gross = basic + project;
    const tds = Math.round(gross * 0.10);
    const net = gross - tds;

    const lines = [
      { name: "Contract Professional Fee", code: "BASIC", category: "BASIC", amount: basic },
      { name: "Project Allowance", code: "PROJ", category: "ALW", amount: project },
      { name: "Gross Fee", code: "GROSS", category: "GROSS", amount: gross },
      { name: "TDS Deduction (10%)", code: "TDS", category: "DED", amount: tds },
      { name: "Net Professional Fee", code: "NET", category: "NET", amount: net },
    ];

    return {
      structureName: "Contractor Salary Structure",
      earnings: [
        { code: "BASIC", name: "Contract Professional Fee", amount: basic },
        { code: "PROJ", name: "Project Allowance", amount: project },
      ],
      deductions: [
        { code: "TDS", name: "TDS Deduction (10%)", amount: tds },
      ],
      gross,
      totalDeductions: tds,
      net,
      lines,
    };
  }

  // Regular Salary Breakdown Formula
  const basic = Math.round(monthlyWage * 0.50);
  const hra = Math.round(basic * 0.20);
  const standard = 5000;
  const bonus = Math.round(basic * 0.10);
  const lta = 2000;
  const fixed = 1500;
  const gross = basic + hra + standard + bonus + lta + fixed;

  const lwf = 200;
  const pf = Math.round(basic * 0.12);
  const esic = Math.round(gross * 0.0075);
  const pt = 200;
  const totalDeductions = lwf + pf + esic + pt;
  const net = gross - totalDeductions;

  const lines = [
    { name: "Basic Salary (50%)", code: "BASIC", category: "BASIC", amount: basic },
    { name: "House Rent Allowance (20%)", code: "HRA", category: "ALW", amount: hra },
    { name: "Standard Allowance", code: "STD", category: "ALW", amount: standard },
    { name: "Performance Bonus (10%)", code: "BONUS", category: "ALW", amount: bonus },
    { name: "Leave Travel Allowance", code: "LTA", category: "ALW", amount: lta },
    { name: "Fixed Special Allowance", code: "FIXED", category: "ALW", amount: fixed },
    { name: "Gross Salary", code: "GROSS", category: "GROSS", amount: gross },
    { name: "Labor Welfare Fund", code: "LWF", category: "DED", amount: lwf },
    { name: "Provident Fund (12%)", code: "PF", category: "DED", amount: pf },
    { name: "ESIC Contribution (0.75%)", code: "ESIC", category: "DED", amount: esic },
    { name: "Professional Tax", code: "PT", category: "DED", amount: pt },
    { name: "Net Salary", code: "NET", category: "NET", amount: net },
  ];

  return {
    structureName: "Regular Salary Structure",
    earnings: [
      { code: "BASIC", name: "Basic Salary (50%)", amount: basic },
      { code: "HRA", name: "House Rent Allowance (20%)", amount: hra },
      { code: "STD", name: "Standard Allowance", amount: standard },
      { code: "BONUS", name: "Performance Bonus (10%)", amount: bonus },
      { code: "LTA", name: "Leave Travel Allowance", amount: lta },
      { code: "FIXED", name: "Fixed Special Allowance", amount: fixed },
    ],
    deductions: [
      { code: "LWF", name: "Labor Welfare Fund", amount: lwf },
      { code: "PF", name: "Provident Fund (12%)", amount: pf },
      { code: "ESIC", name: "ESIC Contribution (0.75%)", amount: esic },
      { code: "PT", name: "Professional Tax", amount: pt },
    ],
    gross,
    totalDeductions,
    net,
    lines,
  };
}

export const calculatePayslipBreakdown = calculateSalaryBreakdown;

