const prisma = require("../config/db");

const getDashboardStats = async () => {
    // 1. Total Active Employees
    const totalEmployees = await prisma.employee.count({
        where: { status: { not: "TERMINATED" } }
    });

    // 2. Total Departments
    const totalDepartments = await prisma.department.count();

    // 3. Pending Time Off Requests
    const pendingTimeOffRequests = await prisma.timeOffRequest.count({
        where: { status: "PENDING" }
    });

    // 4. Latest Payroll Cost (Net Salary Sum)
    const latestPayrun = await prisma.payrun.findFirst({
        orderBy: { periodStart: "desc" },
        include: {
            payslips: {
                select: { netSalary: true }
            }
        }
    });

    let latestPayrollCost = 0;
    if (latestPayrun) {
        latestPayrollCost = latestPayrun.payslips.reduce((sum, slip) => {
            return sum + parseFloat(slip.netSalary);
        }, 0);
    }

    return {
        totalEmployees,
        totalDepartments,
        pendingTimeOffRequests,
        latestPayrollCost
    };
};

module.exports = {
    getDashboardStats
};
