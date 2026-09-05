const prisma = require("../config/db");

// GET all payruns
const getAllPayruns = async () => {
    return await prisma.payrun.findMany({
        include: {
            salaryStructure: { select: { id: true, name: true } },
            _count: { select: { payslips: true } }
        },
        orderBy: { periodStart: "desc" }
    });
};

// GET single payrun by ID
const getPayrunById = async (id) => {
    const payrun = await prisma.payrun.findUnique({
        where: { id },
        include: {
            salaryStructure: { select: { id: true, name: true } },
            payslips: {
                include: {
                    employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true } }
                }
            },
            _count: { select: { payslips: true } }
        }
    });
    if (!payrun) throw new Error("Payrun not found");
    return payrun;
};

// EXECUTE a new Payrun (The Payroll Engine)
const executePayrun = async (data) => {
    const { salaryStructureId, periodStart, periodEnd } = data;

    // 1. Validate inputs
    if (new Date(periodEnd) <= new Date(periodStart)) {
        throw new Error("Period end must be after period start.");
    }

    // 2. Fetch the Salary Structure and all its mathematical Rules
    const structure = await prisma.salaryStructure.findUnique({
        where: { id: salaryStructureId },
        include: { rules: { orderBy: { sequence: "asc" } } }
    });

    if (!structure) throw new Error("Salary Structure not found");
    if (structure.rules.length === 0) throw new Error("This salary structure has no rules. Cannot calculate payroll.");

    // 3. Fetch all ACTIVE contracts that use this structure
    const activeContracts = await prisma.contract.findMany({
        where: {
            salaryStructureId,
            status: "ACTIVE"
        },
        include: { employee: true }
    });

    if (activeContracts.length === 0) {
        throw new Error("No active contracts found for this salary structure.");
    }

    // 4. Check if a payrun already exists for this structure and period
    const existingPayrun = await prisma.payrun.findFirst({
        where: {
            salaryStructureId,
            periodStart: new Date(periodStart),
            periodEnd: new Date(periodEnd)
        }
    });

    if (existingPayrun) {
        throw new Error("A payrun for this structure and period already exists.");
    }

    // 5. Execute the math inside a Database Transaction
    // A transaction ensures that if one payslip fails to calculate, the whole batch is safely rolled back
    const result = await prisma.$transaction(async (tx) => {
        
        // Create the batch header
        const payrun = await tx.payrun.create({
            data: {
                salaryStructureId,
                periodStart: new Date(periodStart),
                periodEnd: new Date(periodEnd),
                status: "COMPUTED"
            }
        });

        // Loop through every employee's contract
        for (const contract of activeContracts) {
            const baseWage = parseFloat(contract.wage);
            let grossSalary = 0;
            let netSalary = 0;
            const payslipLinesData = [];

            // Execute math rules in strict sequence
            for (const rule of structure.rules) {
                let calculatedAmount = 0;

                // MVP Math Engine (Fixed and Percentage only)
                if (rule.ruleType === "FIXED") {
                    calculatedAmount = parseFloat(rule.amount);
                } else if (rule.ruleType === "PERCENTAGE") {
                    calculatedAmount = (parseFloat(rule.amount) / 100) * baseWage;
                }
                
                // Route the calculated amount into Gross and Net buckets based on HR Category
                if (rule.category === "BASIC" || rule.category === "ALLOWANCE") {
                    grossSalary += calculatedAmount;
                    netSalary += calculatedAmount;
                } else if (rule.category === "DEDUCTION") {
                    netSalary -= calculatedAmount;
                }

                // Record the mathematical step for auditing
                payslipLinesData.push({
                    salaryRuleId: rule.id,
                    category: rule.category,
                    amount: calculatedAmount
                });
            }

            // Save the final Payslip and its audit lines for this employee
            await tx.payslip.create({
                data: {
                    employeeId: contract.employeeId,
                    contractId: contract.id,
                    payrunId: payrun.id,
                    grossSalary: grossSalary,
                    netSalary: netSalary,
                    lines: {
                        create: payslipLinesData
                    }
                }
            });
        }

        return payrun;
    });

    return result;
};

// DELETE a payrun (only if not PAID)
const deletePayrun = async (id) => {
    const payrun = await getPayrunById(id);
    if (payrun.status === "PAID") {
        throw new Error("Cannot delete a payrun that has already been PAID.");
    }
    // Deleting the payrun will cascade and delete all associated payslips and payslip lines
    return await prisma.payrun.delete({ where: { id } });
};

module.exports = {
    getAllPayruns,
    getPayrunById,
    executePayrun,
    deletePayrun
};
