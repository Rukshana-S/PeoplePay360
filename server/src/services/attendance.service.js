const prisma = require("../config/db");

// GET all attendance records (with optional employeeId filter)
const getAttendance = async (query) => {
    const where = {};
    if (query.employeeId) where.employeeId = query.employeeId;

    return await prisma.attendance.findMany({
        where,
        include: {
            employee: { select: { id: true, firstName: true, lastName: true, employeeCode: true } }
        },
        orderBy: { checkIn: "desc" }
    });
};

// CHECK-IN (Creates a record for today with current timestamp)
const checkIn = async (employeeId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Business Rule: Check if employee already checked in today
    const existing = await prisma.attendance.findFirst({
        where: {
            employeeId,
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
            employeeId,
            checkIn: new Date(),
            workedHours: 0,
            status: "PRESENT"
        }
    });
};

// CHECK-OUT (Updates today's record with checkout timestamp)
const checkOut = async (employeeId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Business Rule: Must have checked in first
    const existing = await prisma.attendance.findFirst({
        where: {
            employeeId,
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
