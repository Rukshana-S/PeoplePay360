const prisma = require("../config/db");

// GET all salary structures
const getAllStructures = async () => {
    return await prisma.salaryStructure.findMany({
        include: {
            _count: { select: { rules: true, contracts: true, payruns: true } }
        },
        orderBy: { name: "asc" }
    });
};

// GET single salary structure by ID (with all its rules sorted by sequence)
const getStructureById = async (id) => {
    const structure = await prisma.salaryStructure.findUnique({
        where: { id },
        include: {
            rules: { orderBy: { sequence: "asc" } },
            _count: { select: { contracts: true, payruns: true } }
        }
    });
    if (!structure) throw new Error("Salary Structure not found");
    return structure;
};

// CREATE a new salary structure
const createStructure = async (data) => {
    return await prisma.salaryStructure.create({
        data: {
            name: data.name,
            active: data.active !== undefined ? data.active : true
        }
    });
};

// UPDATE a salary structure
const updateStructure = async (id, data) => {
    await getStructureById(id);

    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.active !== undefined) updateData.active = data.active;

    return await prisma.salaryStructure.update({
        where: { id },
        data: updateData,
        include: {
            rules: { orderBy: { sequence: "asc" } },
            _count: { select: { contracts: true, payruns: true } }
        }
    });
};

// DELETE a salary structure (only if no contracts are using it)
const deleteStructure = async (id) => {
    const structure = await getStructureById(id);

    // Business Rule: Cannot delete a structure that is linked to active contracts
    const linkedContracts = await prisma.contract.count({
        where: { salaryStructureId: id }
    });
    if (linkedContracts > 0) {
        throw new Error(`Cannot delete: ${linkedContracts} contract(s) are using this salary structure. Deactivate it instead.`);
    }

    return await prisma.salaryStructure.delete({ where: { id } });
};

module.exports = {
    getAllStructures,
    getStructureById,
    createStructure,
    updateStructure,
    deleteStructure
};
