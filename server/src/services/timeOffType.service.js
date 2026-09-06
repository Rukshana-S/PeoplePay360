const prisma = require("../config/db");

// GET all time off types
const getAllTimeOffTypes = async () => {
    return await prisma.timeOffType.findMany({
        include: {
            _count: { select: { requests: true, allocations: true } }
        },
        orderBy: { name: "asc" }
    });
};

// GET single time off type by ID
const getTimeOffTypeById = async (id) => {
    const type = await prisma.timeOffType.findUnique({
        where: { id },
        include: {
            _count: { select: { requests: true, allocations: true } }
        }
    });
    if (!type) throw new Error("Time Off Type not found");
    return type;
};

// CREATE a new time off type
const createTimeOffType = async (data) => {
    return await prisma.timeOffType.create({
        data: {
            name: data.name,
            unit: data.unit,             // "DAYS" or "HOURS"
            payrollAffects: data.payrollAffects || false
        }
    });
};

// UPDATE a time off type
const updateTimeOffType = async (id, data) => {
    await getTimeOffTypeById(id);
    return await prisma.timeOffType.update({
        where: { id },
        data: {
            name: data.name,
            unit: data.unit,
            payrollAffects: data.payrollAffects
        }
    });
};

// DELETE a time off type
const deleteTimeOffType = async (id) => {
    await getTimeOffTypeById(id);
    return await prisma.timeOffType.delete({ where: { id } });
};

module.exports = {
    getAllTimeOffTypes,
    getTimeOffTypeById,
    createTimeOffType,
    updateTimeOffType,
    deleteTimeOffType
};
