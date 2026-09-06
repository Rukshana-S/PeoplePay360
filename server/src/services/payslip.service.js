const prisma = require("../config/db");

// GET all payslips (with optional filters)
const getAllPayslips = async (query) => {
    const where = {};
    if (query.employeeId) where.employeeId = query.employeeId;
    if (query.payrunId) where.payrunId = query.payrunId;

    return await prisma.payslip.findMany({
        where,
        include: {
            employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true } },
            payrun: { select: { id: true, periodStart: true, periodEnd: true, status: true } }
        },
        orderBy: { id: "desc" }
    });
};

// GET single payslip by ID (with full details and mathematical breakdown)
const getPayslipById = async (id) => {
    const payslip = await prisma.payslip.findUnique({
        where: { id },
        include: {
            employee: { 
                include: { department: true, jobPosition: true } 
            },
            contract: {
                include: { salaryStructure: true }
            },
            payrun: true,
            lines: {
                include: { salaryRule: true },
                orderBy: { salaryRule: { sequence: "asc" } } // Maintain math order for display
            }
        }
    });
    
    if (!payslip) throw new Error("Payslip not found");
    return payslip;
};

module.exports = {
    getAllPayslips,
    getPayslipById
};
