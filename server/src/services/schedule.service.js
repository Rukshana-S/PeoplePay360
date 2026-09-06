const prisma = require("../config/db");

// GET all working schedules
const getAllSchedules = async () => {
    return await prisma.workingSchedule.findMany({
        include: {
            days: { orderBy: { weekday: "asc" } },
            _count: { select: { employees: true, contracts: true } }
        },
        orderBy: { name: "asc" }
    });
};

// GET single schedule by ID
const getScheduleById = async (id) => {
    const schedule = await prisma.workingSchedule.findUnique({
        where: { id },
        include: {
            days: { orderBy: { weekday: "asc" } },
            _count: { select: { employees: true, contracts: true } }
        }
    });
    if (!schedule) throw new Error("Working Schedule not found");
    return schedule;
};

// Helper: Calculate total weekly hours from schedule days
const calculateWeeklyHours = (days) => {
    let totalMinutes = 0;
    for (const day of days) {
        const start = new Date(day.startTime);
        const end = new Date(day.endTime);
        const diffMs = end.getTime() - start.getTime();
        const workedMinutes = diffMs / (1000 * 60);
        // Subtract break time
        const breakMins = day.breakMinutes || 0;
        totalMinutes += workedMinutes - breakMins;
    }
    return (totalMinutes / 60).toFixed(2);
};

// CREATE a new schedule (with nested days)
const createSchedule = async (data) => {
    const weeklyHours = calculateWeeklyHours(data.days);

    return await prisma.workingSchedule.create({
        data: {
            name: data.name,
            weeklyHours: weeklyHours,
            days: {
                create: data.days.map((day) => ({
                    weekday: day.weekday,
                    startTime: new Date(day.startTime),
                    endTime: new Date(day.endTime),
                    breakMinutes: day.breakMinutes || 60
                }))
            }
        },
        include: { days: true }
    });
};

// UPDATE a schedule (delete old days, create new ones)
const updateSchedule = async (id, data) => {
    await getScheduleById(id);

    const weeklyHours = calculateWeeklyHours(data.days);

    // Delete existing days and recreate them (simpler than patching)
    await prisma.scheduleDay.deleteMany({ where: { scheduleId: id } });

    return await prisma.workingSchedule.update({
        where: { id },
        data: {
            name: data.name,
            weeklyHours: weeklyHours,
            days: {
                create: data.days.map((day) => ({
                    weekday: day.weekday,
                    startTime: new Date(day.startTime),
                    endTime: new Date(day.endTime),
                    breakMinutes: day.breakMinutes || 60
                }))
            }
        },
        include: { days: true }
    });
};

// DELETE a schedule
const deleteSchedule = async (id) => {
    await getScheduleById(id);
    return await prisma.workingSchedule.delete({ where: { id } });
};

module.exports = {
    getAllSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule
};
