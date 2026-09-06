const prisma = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all users
// @route   GET /api/users
// @access  Admin only
const getAll = asyncHandler(async (req, res) => {
    // For the UI, we want to return users formatted like the frontend expects:
    // { id, name, email, role, status }
    
    // In our schema, status is on Employee, not User.
    // So we fetch users and their linked employee if any.
    const dbUsers = await prisma.user.findMany({
        include: {
            employee: true
        },
        orderBy: { email: 'asc' }
    });

    const formattedUsers = dbUsers.map(u => ({
        id: u.id,
        email: u.email,
        name: u.employee ? `${u.employee.firstName} ${u.employee.lastName}` : u.email.split('@')[0],
        role: u.role,
        status: u.employee ? u.employee.status : "ACTIVE"
    }));

    res.status(200).json({ success: true, count: formattedUsers.length, data: formattedUsers });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin only
const getById = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { employee: true }
    });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({ success: true, data: user });
});

// @desc    Create a user
// @route   POST /api/users
// @access  Admin only
const create = asyncHandler(async (req, res) => {
    const { email, role, name, password } = req.body;
    
    if (!email || !role) {
        res.status(400);
        throw new Error("Email and Role are required");
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        res.status(400);
        throw new Error("User with this email already exists");
    }

    const user = await prisma.user.create({
        data: {
            email,
            role,
            password: password || "123456", // Default password for hackathon
        }
    });

    // If role is EMPLOYEE or HR_MANAGER
    // we auto-create an Employee record so they can use the attendance/time-off modules immediately.
    if (role === "EMPLOYEE" || role === "HR_MANAGER") {
        // Find or create a default department and job position
        let department = await prisma.department.findFirst();
        if (!department) department = await prisma.department.create({ data: { name: "General" } });
        
        let jobPosition = await prisma.jobPosition.findFirst();
        if (!jobPosition) jobPosition = await prisma.jobPosition.create({ data: { title: "Employee" } });

        const names = name ? name.split(' ') : email.split('@')[0].split('.');
        const firstName = names[0] || "Unknown";
        const lastName = names.slice(1).join(' ') || "Unknown";
        const employeeCode = `EMP-${Math.floor(10000 + Math.random() * 90000)}`;

        const newEmployee = await prisma.employee.create({
            data: {
                employeeCode,
                firstName,
                lastName,
                email,
                hireDate: new Date(),
                status: "ACTIVE",
                employeeType: "FULL_TIME",
                departmentId: department.id,
                jobPositionId: jobPosition.id,
                userId: user.id
            }
        });

        // Find or create a default Annual Leave type
        let leaveType = await prisma.timeOffType.findFirst({ where: { name: "Annual Leave" } });
        if (!leaveType) {
            leaveType = await prisma.timeOffType.create({ data: { name: "Annual Leave", description: "Default Annual Leave", payrollAffects: false } });
        }

        // Assign a default 20 days TimeOffAllocation
        await prisma.timeOffAllocation.create({
            data: {
                employeeId: newEmployee.id,
                typeId: leaveType.id,
                allocated: 20,
                remaining: 20,
                validFrom: new Date(new Date().getFullYear(), 0, 1), // Jan 1st of current year
                validUntil: new Date(new Date().getFullYear(), 11, 31) // Dec 31st of current year
            }
        });
    }

    res.status(201).json({ success: true, data: user });
});

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Admin only
const update = asyncHandler(async (req, res) => {
    const { role, status } = req.body;
    
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { employee: true }
    });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Update user role
    const updateData = {};
    if (role) updateData.role = role;

    const updatedUser = await prisma.user.update({
        where: { id: req.params.id },
        data: updateData
    });

    // If status is provided, update the linked employee (if any)
    if (status && user.employee) {
        await prisma.employee.update({
            where: { id: user.employee.id },
            data: { status }
        });
    }

    res.status(200).json({ success: true, data: updatedUser });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Admin only
const remove = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Disconnect employee if linked before deleting user (because employee has userId unique constraint, or delete cascade handles it depending on schema)
    // Wait, our schema says Employee has `userId String? @unique` and `user User? @relation(fields: [userId], references: [id])`
    // So deleting User directly might fail if it violates foreign key constraint in Employee, unless we set it to null first.
    
    await prisma.employee.updateMany({
        where: { userId: user.id },
        data: { userId: null }
    });

    await prisma.user.delete({
        where: { id: req.params.id }
    });

    res.status(200).json({ success: true, data: {} });
});

module.exports = { getAll, getById, create, update, remove };
