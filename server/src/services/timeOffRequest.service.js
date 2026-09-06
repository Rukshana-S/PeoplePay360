const prisma = require("../config/db");

// GET all time off requests
const getAllRequests = async (query, user) => {
    const where = {};
    if (query.employeeId) where.employeeId = query.employeeId;
    if (query.status) where.status = query.status;

    // If EMPLOYEE, limit to their own employee record
    // HR_MANAGER is allowed to fetch all to approve them
    if (user?.role === "EMPLOYEE") {
        where.employee = { userId: user.id };
    }

    return await prisma.timeOffRequest.findMany({
        where,
        include: {
            employee: { select: { id: true, firstName: true, lastName: true, userId: true } },
            type: { select: { id: true, name: true, payrollAffects: true } }
        },
        orderBy: { startDate: "desc" }
    });
};

// SUBMIT a new time off request
const requestTimeOff = async (data, user) => {
    let finalEmployeeId = data.employeeId;
    
    // Auto-resolve employee ID for EMPLOYEE or HR_MANAGER role
    if (user?.role === "EMPLOYEE" || user?.role === "HR_MANAGER") {
        const emp = await prisma.employee.findUnique({ where: { userId: user.id } });
        if (!emp) throw new Error("Employee profile not found for this user.");
        finalEmployeeId = emp.id;
    }

    if (!finalEmployeeId) throw new Error("Employee ID is required.");

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate < startDate) {
        throw new Error("End date cannot be before start date.");
    }

    // Determine initial status based on the TimeOffType
    const type = await prisma.timeOffType.findUnique({ where: { id: data.typeId } });
    if (!type) throw new Error("Time Off Type not found");
    
    // All requests start as PENDING for MVP
    const initialStatus = "PENDING";

    const duration = ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1; // inclusive of start day

    return await prisma.timeOffRequest.create({
        data: {
            employeeId: finalEmployeeId,
            typeId: data.typeId,
            startDate,
            endDate,
            duration,
            reason: data.reason || null,
            status: initialStatus
        },
        include: { type: true }
    });
};

// REVIEW (Approve or Reject) a time off request
const reviewRequest = async (id, data) => {
    const { status } = data;
    
    if (status !== "APPROVED" && status !== "REJECTED") {
        throw new Error("Status must be either APPROVED or REJECTED");
    }

    const request = await prisma.timeOffRequest.findUnique({ where: { id } });
    if (!request) throw new Error("Time off request not found");

    if (request.status === status) {
        throw new Error(`This request is already ${status.toLowerCase()}`);
    }

    // Find allocation for this type and employee
    const allocation = await prisma.timeOffAllocation.findFirst({
        where: {
            employeeId: request.employeeId,
            typeId: request.typeId
        }
    });

    if (status === "APPROVED") {
        if (allocation) {
            const newRemaining = Number(allocation.remaining) - Number(request.duration);
            if (newRemaining < 0) {
                throw new Error("Insufficient leave balance.");
            }
            await prisma.timeOffAllocation.update({
                where: { id: allocation.id },
                data: { remaining: newRemaining }
            });
        }
    } else if (status === "REJECTED" || status === "PENDING") {
        // Reversal of an already APPROVED request
        if (request.status === "APPROVED" && allocation) {
            const newRemaining = Number(allocation.remaining) + Number(request.duration);
            await prisma.timeOffAllocation.update({
                where: { id: allocation.id },
                data: { remaining: newRemaining }
            });
        }
    }

    return await prisma.timeOffRequest.update({
        where: { id },
        data: { status }
    });
};

module.exports = {
    getAllRequests,
    requestTimeOff,
    reviewRequest
};
