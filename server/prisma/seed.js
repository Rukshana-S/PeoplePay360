const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database with Master Data...');

  // 0. Clean existing master data (optional, but good for resetting during dev)
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.scheduleDay.deleteMany();
  await prisma.workingSchedule.deleteMany();
  await prisma.timeOffType.deleteMany();
  await prisma.jobPosition.deleteMany();
  await prisma.department.deleteMany();

  // 1. Create Departments
  await prisma.department.createMany({
    data: [
      { name: 'Engineering' }, 
      { name: 'Human Resources' }, 
      { name: 'Finance' }, 
      { name: 'Sales' }
    ]
  });

  // 2. Create Job Positions
  await prisma.jobPosition.createMany({
    data: [
      { title: 'Software Engineer' }, 
      { title: 'HR Manager' }, 
      { title: 'Accountant' }, 
      { title: 'Sales Representative' }
    ]
  });

  // 3. Create Time Off Types
  await prisma.timeOffType.createMany({
    data: [
      { name: 'Annual Leave', unit: 'DAYS', payrollAffects: false },
      { name: 'Sick Leave', unit: 'DAYS', payrollAffects: false },
      { name: 'Unpaid Leave', unit: 'DAYS', payrollAffects: true }, // Unpaid leave reduces salary
    ]
  });

  // 4. Create a Default Working Schedule (40 Hours, Mon-Fri)
  await prisma.workingSchedule.create({
    data: {
      name: 'Standard 40 Hours (Mon-Fri)',
      weeklyHours: 40,
      days: {
        create: [
          // Using a generic 1970 date because we only care about the Time (09:00 - 17:00)
          { weekday: 'Monday', startTime: new Date('1970-01-01T09:00:00Z'), endTime: new Date('1970-01-01T17:00:00Z') },
          { weekday: 'Tuesday', startTime: new Date('1970-01-01T09:00:00Z'), endTime: new Date('1970-01-01T17:00:00Z') },
          { weekday: 'Wednesday', startTime: new Date('1970-01-01T09:00:00Z'), endTime: new Date('1970-01-01T17:00:00Z') },
          { weekday: 'Thursday', startTime: new Date('1970-01-01T09:00:00Z'), endTime: new Date('1970-01-01T17:00:00Z') },
          { weekday: 'Friday', startTime: new Date('1970-01-01T09:00:00Z'), endTime: new Date('1970-01-01T17:00:00Z') },
        ]
      }
    }
  });

  // 5. Create Default System Users
  await prisma.user.createMany({
    data: [
      { email: 'admin@company.com', password: '123456', role: 'ADMIN' },
      { email: 'hr@company.com', password: '123456', role: 'HR_MANAGER' },
      { email: 'payroll@company.com', password: '123456', role: 'HR_PAYROLL_MANAGER' },
      { email: 'payrolluser@company.com', password: '123456', role: 'HR_PAYROLL_USER' },
      { email: 'employee@company.com', password: '123456', role: 'EMPLOYEE' }
    ]
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
