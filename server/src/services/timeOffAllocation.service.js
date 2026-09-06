const prisma = require("../config/db");

// GET all time off allocations
const getAllAllocations = async (query, user) => {
    const where = {};
    if (query.employeeId) where.employeeId = query.employeeId;

    // RBAC: If EMPLOYEE or HR_MANAGER role, strictly limit to their own employee record
    if (user?.role === "EMPLOYEE" || user?.role === "HR_MANAGER") {
        where.employee = { userId: user.id };

        // Auto-allocate logic for the logged-in user
        const emp = await prisma.employee.findUnique({ where: { userId: user.id } });
        if (emp && emp.status === 'ACTIVE') {
            const annualLeaveType = await prisma.timeOffType.findUnique({ where: { name: 'Annual Leave' } });
            if (annualLeaveType) {
                const existing = await prisma.timeOffAllocation.findFirst({
                    where: { employeeId: emp.id, typeId: annualLeaveType.id }
                });
                if (!existing) {
                    await prisma.timeOffAllocation.create({
                        data: {
                            employeeId: emp.id,
                            typeId: annualLeaveType.id,
                            allocated: 20,
                            remaining: 20,
                            validFrom: new Date(new Date().getFullYear(), 0, 1),
                            validUntil: new Date(new Date().getFullYear(), 11, 31)
                        }
                    });
                }
            }
        }
    }

    return await prisma.timeOffAllocation.findMany({
        where,
        include: {
            employee: { select: { id: true, firstName: true, lastName: true, userId: true } },
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

    // 3. Create or Update allocation
    const allocated = parseFloat(data.allocated);
    if (allocated < 1 || allocated > 365) {
        throw new Error("Allocated days must be between 1 and 365");
    }

    const existing = await prisma.timeOffAllocation.findFirst({
        where: { employeeId: data.employeeId, typeId: data.typeId }
    });

    if (existing) {
        const used = Number(existing.allocated) - Number(existing.remaining);
        const newRemaining = allocated - used;
        
        return await prisma.timeOffAllocation.update({
            where: { id: existing.id },
            data: {
                allocated: allocated,
                remaining: newRemaining,
                validFrom: new Date(data.validFrom),
                validUntil: new Date(data.validUntil)
            },
            include: { type: true }
        });
    }

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

const deleteAllocation = async (id) => {
    const allocation = await prisma.timeOffAllocation.findUnique({ where: { id } });
    if (!allocation) throw new Error("Allocation not found");

    const approvedRequests = await prisma.timeOffRequest.findFirst({
        where: {
            employeeId: allocation.employeeId,
            typeId: allocation.typeId,
            status: "APPROVED"
        }
    });

    if (approvedRequests) {
        throw new Error("Allocation cannot be deleted because leave history exists.");
    }

    return await prisma.timeOffAllocation.delete({ where: { id } });
};

module.exports = {
    getAllAllocations,
    allocateDays,
    deleteAllocation
};
