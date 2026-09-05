const prisma = require("../config/db");

// GET all time off allocations
const getAllAllocations = async (query) => {
    const where = {};
    if (query.employeeId) where.employeeId = query.employeeId;

    return await prisma.timeOffAllocation.findMany({
        where,
        include: {
            employee: { select: { id: true, firstName: true, lastName: true } },
            type: { select: { id: true, name: true, payrollAffects: true } }
        },
        orderBy: { validUntil: "desc" }
    });
};

// ALLOCATE days to an employee
const allocateDays = async (data) => {
    // 1. Validate employee exists
    const employee = await prisma.employee.findUnique({ where: { id: data.employeeId } });
    if (!employee) throw new Error("Employee not found");

    // 2. Validate time off type exists
    const type = await prisma.timeOffType.findUnique({ where: { id: data.typeId } });
    if (!type) throw new Error("Time Off Type not found");

    // 3. Create allocation
    const allocated = parseFloat(data.allocated);
    return await prisma.timeOffAllocation.create({
        data: {
            employeeId: data.employeeId,
            typeId: data.typeId,
            allocated: allocated,
            remaining: allocated,
            validFrom: new Date(data.validFrom),
            validUntil: new Date(data.validUntil)
        },
        include: {
            type: true
        }
    });
};

module.exports = {
    getAllAllocations,
    allocateDays
};
