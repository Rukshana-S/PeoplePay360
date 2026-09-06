const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const hrUser = await prisma.user.findUnique({
        where: { email: 'hr1@company.com' },
        include: { employee: true }
    });
    console.log('HR Employee:', hrUser?.employee);

    if (hrUser && hrUser.employee) {
        const managed = await prisma.employee.findMany({
            where: { managerId: hrUser.employee.id }
        });
        console.log('Managed Employees:', managed.length, managed.map(m => m.email));
        
        const allEmployees = await prisma.employee.findMany({
            where: { id: { not: hrUser.employee.id } }
        });
        console.log('All Employees:', allEmployees.map(e => e.firstName));

        // Assign them to this HR manager
        for (const emp of allEmployees) {
            await prisma.employee.update({
                where: { id: emp.id },
                data: { managerId: hrUser.employee.id }
            });
        }
        console.log('Successfully assigned', allEmployees.length, 'employees to HR manager');
    }
}
main().finally(() => prisma.$disconnect());
