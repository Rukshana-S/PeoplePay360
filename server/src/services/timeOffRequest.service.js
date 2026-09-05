const prisma = require("../config/db");

// GET all time off requests
const getAllRequests = async (query) => {
    const where = {};
    if (query.employeeId) where.employeeId = query.employeeId;
    if (query.status) where.status = query.status;

    return await prisma.timeOffRequest.findMany({
        where,
        include: {
            employee: { select: { id: true, firstName: true, lastName: true } },
            type: { select: { id: true, name: true, payrollAffects: true } }
        },
        orderBy: { startDate: "desc" }
    });
};

// SUBMIT a new time off request
const requestTimeOff = async (data) => {
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
            employeeId: data.employeeId,
            typeId: data.typeId,
            startDate,
            endDate,
            duration,
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

    if (request.status !== "PENDING") {
        throw new Error(`This request has already been ${request.status.toLowerCase()}`);
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
