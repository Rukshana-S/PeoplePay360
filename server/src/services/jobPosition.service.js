const prisma = require("../config/db");

// GET all job positions
const getAllJobPositions = async () => {
    return await prisma.jobPosition.findMany({
        include: {
            _count: { select: { employees: true, contracts: true } }
        },
        orderBy: { title: "asc" }
    });
};

// GET single job position by ID
const getJobPositionById = async (id) => {
    const jobPosition = await prisma.jobPosition.findUnique({
        where: { id },
        include: {
            _count: { select: { employees: true, contracts: true } }
        }
    });
    if (!jobPosition) throw new Error("Job Position not found");
    return jobPosition;
};

// CREATE a new job position
const createJobPosition = async (data) => {
    return await prisma.jobPosition.create({ data: { title: data.title } });
};

// UPDATE a job position
const updateJobPosition = async (id, data) => {
    await getJobPositionById(id);
    return await prisma.jobPosition.update({
        where: { id },
        data: { title: data.title }
    });
};

// DELETE a job position
const deleteJobPosition = async (id) => {
    await getJobPositionById(id);
    return await prisma.jobPosition.delete({ where: { id } });
};

module.exports = {
    getAllJobPositions,
    getJobPositionById,
    createJobPosition,
    updateJobPosition,
    deleteJobPosition
};
