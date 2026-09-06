const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const struct = await prisma.salaryStructure.findFirst({ where: { name: 'Regular Salary Structure' } });
    if (!struct) return console.log('Structure not found');

    const employees = await prisma.employee.findMany({
        where: { status: 'ACTIVE' }
    });

    let count=0;
    for (const emp of employees) {
        const existing = await prisma.contract.findFirst({ where: { employeeId: emp.id, status: 'ACTIVE' } });
        if (!existing) {
            await prisma.contract.create({
                data: {
                    employeeId: emp.id,
                    salaryStructureId: struct.id,
                    departmentId: emp.departmentId,
                    jobPositionId: emp.jobPositionId,
                    scheduleId: emp.scheduleId,
                    startDate: new Date('2026-09-01T00:00:00Z'),
                    wage: 80000,
                    status: 'ACTIVE'
                }
            });
            count++;
        }
    }
    console.log('Created ' + count + ' active contracts using Regular Salary Structure.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
