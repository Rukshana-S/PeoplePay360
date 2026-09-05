const prisma = require("../config/db");

// GET all employees with filters
const getAllEmployees = async (query) => {
    const where = {};

    // Filter by department
    if (query.departmentId) where.departmentId = query.departmentId;
    // Filter by status
    if (query.status) where.status = query.status;
    // Filter by employee type
    if (query.employeeType) where.employeeType = query.employeeType;
    // Search by name
    if (query.search) {
        where.OR = [
            { firstName: { contains: query.search, mode: "insensitive" } },
            { lastName: { contains: query.search, mode: "insensitive" } },
            { employeeCode: { contains: query.search, mode: "insensitive" } },
        ];
    }

    return await prisma.employee.findMany({
        where,
        include: {
            department: true,
            jobPosition: true,
            schedule: true,
            manager: { select: { id: true, firstName: true, lastName: true } },
            _count: { select: { contracts: true, attendances: true, timeOffRequests: true, payslips: true } }
        },
        orderBy: { firstName: "asc" }
    });
};

// GET single employee by ID (with full details)
const getEmployeeById = async (id) => {
    const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
            department: true,
            jobPosition: true,
            schedule: true,
            manager: { select: { id: true, firstName: true, lastName: true } },
            subordinates: { select: { id: true, firstName: true, lastName: true } },
            contracts: { orderBy: { startDate: "desc" } },
            _count: { select: { contracts: true, attendances: true, timeOffRequests: true, payslips: true } }
        }
    });
    if (!employee) throw new Error("Employee not found");
    return employee;
};

// CREATE a new employee
const createEmployee = async (data) => {
    return await prisma.employee.create({
        data: {
            employeeCode: data.employeeCode,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            hireDate: new Date(data.hireDate),
            status: data.status || "ACTIVE",
            employeeType: data.employeeType || "FULL_TIME",
            departmentId: data.departmentId,
            jobPositionId: data.jobPositionId,
            scheduleId: data.scheduleId || null,
            managerId: data.managerId || null,
        },
        include: {
            department: true,
            jobPosition: true,
        }
    });
};

// UPDATE an employee
const updateEmployee = async (id, data) => {
    await getEmployeeById(id); // Throws if not found

    const updateData = {};
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.email) updateData.email = data.email;
    if (data.hireDate) updateData.hireDate = new Date(data.hireDate);
    if (data.status) updateData.status = data.status;
    if (data.employeeType) updateData.employeeType = data.employeeType;
    if (data.departmentId) updateData.departmentId = data.departmentId;
    if (data.jobPositionId) updateData.jobPositionId = data.jobPositionId;
    if (data.scheduleId !== undefined) updateData.scheduleId = data.scheduleId || null;
    if (data.managerId !== undefined) updateData.managerId = data.managerId || null;

    return await prisma.employee.update({
        where: { id },
        data: updateData,
        include: {
            department: true,
            jobPosition: true,
        }
    });
};

// DELETE (soft-delete: set status to TERMINATED)
const deleteEmployee = async (id) => {
    await getEmployeeById(id);
    return await prisma.employee.update({
        where: { id },
        data: { status: "TERMINATED" }
    });
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
