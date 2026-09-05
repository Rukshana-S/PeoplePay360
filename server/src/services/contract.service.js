const prisma = require("../config/db");

// GET all contracts (with optional employee filter)
const getAllContracts = async (query) => {
    const where = {};

    if (query.employeeId) where.employeeId = query.employeeId;
    if (query.status) where.status = query.status;

    return await prisma.contract.findMany({
        where,
        include: {
            employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true } },
            department: true,
            jobPosition: true,
            salaryStructure: true,
        },
        orderBy: { startDate: "desc" }
    });
};

// GET single contract by ID
const getContractById = async (id) => {
    const contract = await prisma.contract.findUnique({
        where: { id },
        include: {
            employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true } },
            department: true,
            jobPosition: true,
            schedule: true,
            salaryStructure: { include: { rules: { orderBy: { sequence: "asc" } } } },
        }
    });
    if (!contract) throw new Error("Contract not found");
    return contract;
};

// CREATE a new contract
const createContract = async (data) => {
    // Business Rule: Only one ACTIVE contract per employee at a time
    if (data.status === "ACTIVE") {
        const existingActive = await prisma.contract.findFirst({
            where: {
                employeeId: data.employeeId,
                status: "ACTIVE"
            }
        });
        if (existingActive) {
            throw new Error("This employee already has an active contract. Please expire or terminate it first.");
        }
    }

    // Business Rule: endDate must be after startDate (if provided)
    if (data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
        throw new Error("End date must be after start date");
    }

    return await prisma.contract.create({
        data: {
            employeeId: data.employeeId,
            salaryStructureId: data.salaryStructureId,
            departmentId: data.departmentId,
            jobPositionId: data.jobPositionId,
            scheduleId: data.scheduleId || null,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
            wage: data.wage,
            status: data.status || "DRAFT",
        },
        include: {
            employee: { select: { id: true, firstName: true, lastName: true } },
            department: true,
            jobPosition: true,
            salaryStructure: true,
        }
    });
};

// UPDATE a contract
const updateContract = async (id, data) => {
    const existing = await getContractById(id);

    // Business Rule: Cannot edit a contract that has been TERMINATED
    if (existing.status === "TERMINATED") {
        throw new Error("Cannot modify a terminated contract");
    }

    // Business Rule: If activating, check no other active contract exists
    if (data.status === "ACTIVE" && existing.status !== "ACTIVE") {
        const existingActive = await prisma.contract.findFirst({
            where: {
                employeeId: existing.employeeId,
                status: "ACTIVE",
                id: { not: id }
            }
        });
        if (existingActive) {
            throw new Error("This employee already has an active contract.");
        }
    }

    // Business Rule: endDate must be after startDate
    const startDate = data.startDate ? new Date(data.startDate) : existing.startDate;
    const endDate = data.endDate ? new Date(data.endDate) : existing.endDate;
    if (endDate && endDate <= startDate) {
        throw new Error("End date must be after start date");
    }

    const updateData = {};
    if (data.salaryStructureId) updateData.salaryStructureId = data.salaryStructureId;
    if (data.departmentId) updateData.departmentId = data.departmentId;
    if (data.jobPositionId) updateData.jobPositionId = data.jobPositionId;
    if (data.scheduleId !== undefined) updateData.scheduleId = data.scheduleId || null;
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.wage) updateData.wage = data.wage;
    if (data.status) updateData.status = data.status;

    return await prisma.contract.update({
        where: { id },
        data: updateData,
        include: {
            employee: { select: { id: true, firstName: true, lastName: true } },
            department: true,
            jobPosition: true,
            salaryStructure: true,
        }
    });
};

// DELETE a contract (only DRAFT contracts can be deleted)
const deleteContract = async (id) => {
    const contract = await getContractById(id);
    if (contract.status !== "DRAFT") {
        throw new Error("Only DRAFT contracts can be deleted. Use status change to TERMINATED instead.");
    }
    return await prisma.contract.delete({ where: { id } });
};

module.exports = {
    getAllContracts,
    getContractById,
    createContract,
    updateContract,
    deleteContract
};
