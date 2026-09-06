const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding leave types and allocations...");

  // Find HR Manager employee
  const hrUser = await prisma.user.findFirst({ where: { role: "HR_MANAGER" } });
  if (!hrUser) {
    console.log("No HR_MANAGER found.");
    return;
  }

  let employee = await prisma.employee.findUnique({ where: { userId: hrUser.id } });
  if (!employee) {
    employee = await prisma.employee.create({
      data: {
        userId: hrUser.id,
        firstName: "hr",
        lastName: "Unknown",
        employeeCode: "EMP-HR-001",
        email: hrUser.email,
        phone: "1234567890",
        hireDate: new Date(),
        baseSalary: 50000,
        status: "ACTIVE",
      }
    });
  }

  const leaveData = [
    { name: "Annual Leave", allocated: 20, used: 5 },
    { name: "Sick Leave", allocated: 20, used: 2 },
    { name: "Casual Leave", allocated: 20, used: 1 },
    { name: "Emergency Leave", allocated: 20, used: 0 },
    { name: "Compensatory Off", allocated: 20, used: 0 },
  ];

  for (const leave of leaveData) {
    let type = await prisma.timeOffType.findUnique({ where: { name: leave.name } });
    if (!type) {
      type = await prisma.timeOffType.create({
        data: {
          name: leave.name,
          unit: "DAYS",
          payrollAffects: false,
        }
      });
    }

    // Check if allocation already exists
    const existingAlloc = await prisma.timeOffAllocation.findFirst({
      where: { employeeId: employee.id, typeId: type.id }
    });

    if (existingAlloc) {
      await prisma.timeOffAllocation.update({
        where: { id: existingAlloc.id },
        data: {
          allocated: leave.allocated,
          remaining: leave.allocated - leave.used,
          validFrom: new Date("2026-01-01"),
          validUntil: new Date("2026-12-31"),
        }
      });
    } else {
      await prisma.timeOffAllocation.create({
        data: {
          employeeId: employee.id,
          typeId: type.id,
          allocated: leave.allocated,
          remaining: leave.allocated - leave.used,
          validFrom: new Date("2026-01-01"),
          validUntil: new Date("2026-12-31"),
        }
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
