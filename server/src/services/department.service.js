const prisma = require("../config/db");

const getAllDepartments = async () => {
    return await prisma.department.findMany({
        include: {
            _count: { select: { employees: true, contracts: true } }
        },
        orderBy: { name: "asc" }
    });
};

const getDepartmentById = async (id) => {
    const department = await prisma.department.findUnique({
        where: { id },
        include: {
            employees: true,
            _count: { select: { employees: true, contracts: true } }
        }
    });
    if (!department) throw new Error("Department not found");
    return department;
};

const createDepartment = async (data) => {
    return await prisma.department.create({ data: { name: data.name } });
};

const updateDepartment = async (id, data) => {
    await getDepartmentById(id);
    return await prisma.department.update({
        where: { id },
        data: { name: data.name }
    });
};

const deleteDepartment = async (id) => {
    await getDepartmentById(id);
    return await prisma.department.delete({ where: { id } });
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
