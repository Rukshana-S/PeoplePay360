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

            // Dynamic variables for formula evaluation
            const vars = {
                WAGE: baseWage,
                BASIC: 0,
                GROSS: 0
            };

            // Execute math rules in strict sequence
            for (const rule of structure.rules) {
                let calculatedAmount = 0;

                // MVP Math Engine (Fixed and Percentage only)
                if (rule.ruleType === "FIXED") {
                    calculatedAmount = parseFloat(rule.amount);
                } else if (rule.ruleType === "PERCENTAGE") {
                    calculatedAmount = (parseFloat(rule.amount) / 100) * baseWage;
                } else if (rule.ruleType === "FORMULA" && rule.formula) {
                    let expression = rule.formula.toUpperCase();
                    expression = expression.replace(/WAGE/g, vars.WAGE);
                    expression = expression.replace(/BASIC/g, vars.BASIC);
                    expression = expression.replace(/GROSS/g, vars.GROSS);
                    
                    try {
                        calculatedAmount = eval(expression);
                        if (isNaN(calculatedAmount)) calculatedAmount = 0;
                    } catch (e) {
                        console.error("Formula error for rule " + rule.code + ":", e);
                        calculatedAmount = 0;
                    }
                }
                
                // Route the calculated amount into Gross and Net buckets based on HR Category
                if (rule.category === "BASIC" || rule.category === "ALLOWANCE") {
                    grossSalary += calculatedAmount;
                    netSalary += calculatedAmount;
                    
                    if (rule.category === "BASIC") {
                        vars.BASIC += calculatedAmount;
                    }
                    vars.GROSS = grossSalary;
                } else if (rule.category === "DEDUCTION" || rule.category === "CONTRIBUTION") {
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

// UPDATE Payrun Status (and cascade to payslips)
const updatePayrunStatus = async (id, status) => {
    const payrun = await getPayrunById(id);
    
    // Status can be VALIDATED or PAID
    // Update the payrun and all associated payslips in a transaction
    return await prisma.$transaction(async (tx) => {
        const updatedPayrun = await tx.payrun.update({
            where: { id },
            data: { status }
        });

        // Determine payslip status based on payrun status
        let payslipStatus = "DRAFT";
        if (status === "VALIDATED") payslipStatus = "VALIDATED";
        if (status === "PAID") payslipStatus = "PAID";

        await tx.payslip.updateMany({
            where: { payrunId: id },
            data: { status: payslipStatus }
        });

        return updatedPayrun;
    });
};

// RECOMPUTE Payrun
const recomputePayrun = async (id) => {
    const payrun = await getPayrunById(id);
    
    if (payrun.status === "VALIDATED" || payrun.status === "PAID") {
        throw new Error("Cannot recompute a Payrun that is already Validated or Paid.");
    }

    // Since we already have executePayrun logic, the easiest way to recompute
    // is to delete the current payslips, and call executePayrun logic again,
    // or simply delete the payrun and recreate it! But we want to keep the same ID.
    // So let's delete existing payslips and re-run the engine loop.
    
    return await prisma.$transaction(async (tx) => {
        // Delete all payslips (lines cascade)
        await tx.payslip.deleteMany({ where: { payrunId: id } });

        // Fetch active contracts for this structure
        const activeContracts = await tx.contract.findMany({
            where: {
                salaryStructureId: payrun.salaryStructureId,
                status: "ACTIVE"
            },
            include: { employee: true }
        });

        const structure = await tx.salaryStructure.findUnique({
            where: { id: payrun.salaryStructureId },
            include: { rules: { orderBy: { sequence: "asc" } } }
        });

        for (const contract of activeContracts) {
            const baseWage = parseFloat(contract.wage);
            let grossSalary = 0;
            let netSalary = 0;
            const payslipLinesData = [];

            const vars = { WAGE: baseWage, BASIC: 0, GROSS: 0 };

            for (const rule of structure.rules) {
                let calculatedAmount = 0;
                if (rule.ruleType === "FIXED") {
                    calculatedAmount = parseFloat(rule.amount);
                } else if (rule.ruleType === "PERCENTAGE") {
                    calculatedAmount = (parseFloat(rule.amount) / 100) * baseWage;
                } else if (rule.ruleType === "FORMULA" && rule.formula) {
                    let expression = rule.formula.toUpperCase();
                    expression = expression.replace(/WAGE/g, vars.WAGE);
                    expression = expression.replace(/BASIC/g, vars.BASIC);
                    expression = expression.replace(/GROSS/g, vars.GROSS);
                    try {
                        calculatedAmount = eval(expression);
                        if (isNaN(calculatedAmount)) calculatedAmount = 0;
                    } catch (e) {
                        calculatedAmount = 0;
                    }
                }
                
                if (rule.category === "BASIC" || rule.category === "ALLOWANCE") {
                    grossSalary += calculatedAmount;
                    netSalary += calculatedAmount;
                    if (rule.category === "BASIC") vars.BASIC += calculatedAmount;
                    vars.GROSS = grossSalary;
                } else if (rule.category === "DEDUCTION" || rule.category === "CONTRIBUTION") {
                    netSalary -= calculatedAmount;
                }

                payslipLinesData.push({
                    salaryRuleId: rule.id,
                    category: rule.category,
                    amount: calculatedAmount
                });
            }

            await tx.payslip.create({
                data: {
                    employeeId: contract.employeeId,
                    contractId: contract.id,
                    payrunId: payrun.id,
                    grossSalary: grossSalary,
                    netSalary: netSalary,
                    lines: { create: payslipLinesData }
                }
            });
        }

        // Update status back to COMPUTED
        return await tx.payrun.update({
            where: { id },
            data: { status: "COMPUTED" }
        });
    });
};

module.exports = {
    getAllPayruns,
    getPayrunById,
    executePayrun,
    deletePayrun,
    updatePayrunStatus,
    recomputePayrun
};
