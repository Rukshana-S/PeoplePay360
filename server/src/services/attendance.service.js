const prisma = require("../config/db");

// GET all attendance records (with optional employeeId filter)
const getAttendance = async (query, user) => {
    const where = {};
    if (query.employeeId) where.employeeId = query.employeeId;
    
    // RBAC: If EMPLOYEE role, strictly limit to their own employee record
    if (user?.role === "EMPLOYEE") {
        where.employee = { userId: user.id };
    }

    return await prisma.attendance.findMany({
        where,
        include: {
            employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true } }
        },
        orderBy: { checkIn: "desc" }
    });
};

// CHECK-IN (Creates a record for today with current timestamp)
const checkIn = async (employeeId, user) => {
    let finalEmployeeId = employeeId;
    
    // Auto-resolve employee ID for EMPLOYEE or HR_MANAGER role
    if (user?.role === "EMPLOYEE" || (user?.role === "HR_MANAGER" && !employeeId)) {
        const emp = await prisma.employee.findUnique({ where: { userId: user.id } });
        if (!emp) throw new Error("Employee profile not found for this user.");
        finalEmployeeId = emp.id;
    }
    
    if (!finalEmployeeId) throw new Error("Employee ID is required.");

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Business Rule: Check if employee already checked in today
    const existing = await prisma.attendance.findFirst({
        where: {
            employeeId: finalEmployeeId,
            checkIn: {
                gte: startOfDay,
                lte: endOfDay
            }
        }
    });

    if (existing) {
        throw new Error("Employee has already checked in today.");
    }

    return await prisma.attendance.create({
        data: {
            employeeId: finalEmployeeId,
            checkIn: new Date(),
            workedHours: 0,
            status: "PRESENT"
        }
    });
};

// CHECK-OUT (Updates today's record with checkout timestamp)
const checkOut = async (employeeId, user) => {
    let finalEmployeeId = employeeId;
    
    // Auto-resolve employee ID for EMPLOYEE or HR_MANAGER role
    if (user?.role === "EMPLOYEE" || (user?.role === "HR_MANAGER" && !employeeId)) {
        const emp = await prisma.employee.findUnique({ where: { userId: user.id } });
        if (!emp) throw new Error("Employee profile not found for this user.");
        finalEmployeeId = emp.id;
    }

    if (!finalEmployeeId) throw new Error("Employee ID is required.");

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Business Rule: Must have checked in first
    const existing = await prisma.attendance.findFirst({
        where: {
            employeeId: finalEmployeeId,
            checkIn: {
                gte: startOfDay,
                lte: endOfDay
            }
        }
    });

    if (!existing) {
        throw new Error("Employee has not checked in today.");
    }

    if (existing.checkOut) {
        throw new Error("Employee has already checked out today.");
    }

    const checkOutTime = new Date();
    const workedHours = (checkOutTime.getTime() - existing.checkIn.getTime()) / (1000 * 60 * 60);

    return await prisma.attendance.update({
        where: { id: existing.id },
        data: {
            checkOut: checkOutTime,
            workedHours: workedHours
        }
    });
};

module.exports = {
    getAttendance,
    checkIn,
    checkOut
};
