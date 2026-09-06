-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('EMPLOYEE', 'HR_MANAGER', 'HR_PAYROLL_USER', 'HR_PAYROLL_MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'LATE', 'ABSENT', 'OVERTIME', 'MISSING_CHECKOUT');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AllocationUnit" AS ENUM ('DAYS', 'HOURS');

-- CreateEnum
CREATE TYPE "SalaryCategory" AS ENUM ('BASIC', 'ALLOWANCE', 'GROSS', 'DEDUCTION', 'CONTRIBUTION', 'NET');

-- CreateEnum
CREATE TYPE "RuleType" AS ENUM ('FIXED', 'PERCENTAGE', 'FORMULA');

-- CreateEnum
CREATE TYPE "PayrunStatus" AS ENUM ('DRAFT', 'COMPUTED', 'VALIDATED', 'PAID');

-- CreateEnum
CREATE TYPE "PayslipStatus" AS ENUM ('DRAFT', 'COMPUTED', 'VALIDATED', 'PAID');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_positions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "job_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_schedules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weeklyHours" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "working_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_days" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "weekday" TEXT NOT NULL,
    "startTime" TIME(0) NOT NULL,
    "endTime" TIME(0) NOT NULL,
    "breakMinutes" INTEGER NOT NULL DEFAULT 60,

    CONSTRAINT "schedule_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "status" "EmployeeStatus" NOT NULL,
    "employeeType" "EmployeeType" NOT NULL DEFAULT 'FULL_TIME',
    "departmentId" TEXT NOT NULL,
    "jobPositionId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "managerId" TEXT,
    "userId" TEXT,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "salaryStructureId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "jobPositionId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "wage" DECIMAL(12,2) NOT NULL,
    "status" "ContractStatus" NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3),
    "workedHours" DECIMAL(5,2) NOT NULL,
    "status" "AttendanceStatus" NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_off_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" "AllocationUnit" NOT NULL,
    "payrollAffects" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "time_off_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_off_requests" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "duration" DECIMAL(5,2) NOT NULL,
    "status" "RequestStatus" NOT NULL,

    CONSTRAINT "time_off_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_off_allocations" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "allocated" DECIMAL(5,2) NOT NULL,
    "remaining" DECIMAL(5,2) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_off_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_structures" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "salary_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_rules" (
    "id" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category" "SalaryCategory" NOT NULL,
    "sequence" INTEGER NOT NULL,
    "ruleType" "RuleType" NOT NULL,
    "amount" DECIMAL(12,2),

    CONSTRAINT "salary_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payruns" (
    "id" TEXT NOT NULL,
    "salaryStructureId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" "PayrunStatus" NOT NULL,

    CONSTRAINT "payruns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payslips" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "payrunId" TEXT NOT NULL,
    "grossSalary" DECIMAL(12,2) NOT NULL,
    "netSalary" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "payslips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payslip_lines" (
    "id" TEXT NOT NULL,
    "payslipId" TEXT NOT NULL,
    "salaryRuleId" TEXT NOT NULL,
    "category" "SalaryCategory" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "payslip_lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "job_positions_title_key" ON "job_positions"("title");

-- CreateIndex
CREATE INDEX "schedule_days_scheduleId_idx" ON "schedule_days"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employeeCode_key" ON "employees"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_userId_key" ON "employees"("userId");

-- CreateIndex
CREATE INDEX "employees_departmentId_idx" ON "employees"("departmentId");

-- CreateIndex
CREATE INDEX "employees_jobPositionId_idx" ON "employees"("jobPositionId");

-- CreateIndex
CREATE INDEX "employees_scheduleId_idx" ON "employees"("scheduleId");

-- CreateIndex
CREATE INDEX "employees_managerId_idx" ON "employees"("managerId");

-- CreateIndex
CREATE INDEX "contracts_employeeId_idx" ON "contracts"("employeeId");

-- CreateIndex
CREATE INDEX "contracts_salaryStructureId_idx" ON "contracts"("salaryStructureId");

-- CreateIndex
CREATE INDEX "contracts_startDate_endDate_idx" ON "contracts"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "attendances_employeeId_idx" ON "attendances"("employeeId");

-- CreateIndex
CREATE INDEX "attendances_checkIn_idx" ON "attendances"("checkIn");

-- CreateIndex
CREATE UNIQUE INDEX "time_off_types_name_key" ON "time_off_types"("name");

-- CreateIndex
CREATE INDEX "time_off_requests_employeeId_idx" ON "time_off_requests"("employeeId");

-- CreateIndex
CREATE INDEX "time_off_requests_typeId_idx" ON "time_off_requests"("typeId");

-- CreateIndex
CREATE INDEX "time_off_allocations_employeeId_idx" ON "time_off_allocations"("employeeId");

-- CreateIndex
CREATE INDEX "time_off_allocations_typeId_idx" ON "time_off_allocations"("typeId");

-- CreateIndex
CREATE UNIQUE INDEX "salary_structures_name_key" ON "salary_structures"("name");

-- CreateIndex
CREATE INDEX "salary_rules_structureId_idx" ON "salary_rules"("structureId");

-- CreateIndex
CREATE INDEX "salary_rules_sequence_idx" ON "salary_rules"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "salary_rules_structureId_code_key" ON "salary_rules"("structureId", "code");

-- CreateIndex
CREATE INDEX "payruns_salaryStructureId_idx" ON "payruns"("salaryStructureId");

-- CreateIndex
CREATE INDEX "payruns_periodStart_periodEnd_idx" ON "payruns"("periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "payslips_contractId_idx" ON "payslips"("contractId");

-- CreateIndex
CREATE INDEX "payslips_payrunId_idx" ON "payslips"("payrunId");

-- CreateIndex
CREATE UNIQUE INDEX "payslips_employeeId_payrunId_key" ON "payslips"("employeeId", "payrunId");

-- CreateIndex
CREATE INDEX "payslip_lines_payslipId_idx" ON "payslip_lines"("payslipId");

-- CreateIndex
CREATE INDEX "payslip_lines_salaryRuleId_idx" ON "payslip_lines"("salaryRuleId");

-- AddForeignKey
ALTER TABLE "schedule_days" ADD CONSTRAINT "schedule_days_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "working_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "job_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "working_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "job_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "working_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_salaryStructureId_fkey" FOREIGN KEY ("salaryStructureId") REFERENCES "salary_structures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_off_requests" ADD CONSTRAINT "time_off_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_off_requests" ADD CONSTRAINT "time_off_requests_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "time_off_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_off_allocations" ADD CONSTRAINT "time_off_allocations_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_off_allocations" ADD CONSTRAINT "time_off_allocations_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "time_off_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_rules" ADD CONSTRAINT "salary_rules_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "salary_structures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payruns" ADD CONSTRAINT "payruns_salaryStructureId_fkey" FOREIGN KEY ("salaryStructureId") REFERENCES "salary_structures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_payrunId_fkey" FOREIGN KEY ("payrunId") REFERENCES "payruns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip_lines" ADD CONSTRAINT "payslip_lines_payslipId_fkey" FOREIGN KEY ("payslipId") REFERENCES "payslips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip_lines" ADD CONSTRAINT "payslip_lines_salaryRuleId_fkey" FOREIGN KEY ("salaryRuleId") REFERENCES "salary_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
