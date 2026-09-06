const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Salary Structures...');

    // 1. Regular Salary Structure
    const struct1 = await prisma.salaryStructure.upsert({
        where: { name: 'Regular Salary Structure' },
        update: {},
        create: {
            name: 'Regular Salary Structure',
            active: true
        }
    });

    // Structure 1 Rules
    const rules1 = [
        { name: 'Basic Pay', code: 'BASIC', category: 'BASIC', sequence: 10, ruleType: 'FORMULA', formula: 'WAGE * 0.50' },
        { name: 'House Rent Allowance (HRA)', code: 'HRA', category: 'ALLOWANCE', sequence: 20, ruleType: 'FORMULA', formula: 'BASIC * 0.20' },
        { name: 'Dearness Allowance (DA)', code: 'DA', category: 'ALLOWANCE', sequence: 30, ruleType: 'FORMULA', formula: 'BASIC * 0.10' },
        { name: 'Medical Allowance', code: 'MED', category: 'ALLOWANCE', sequence: 40, ruleType: 'FIXED', amount: 1500 },
        { name: 'Transport Allowance', code: 'TA', category: 'ALLOWANCE', sequence: 50, ruleType: 'FIXED', amount: 2000 },
        { name: 'Special Allowance', code: 'SA', category: 'ALLOWANCE', sequence: 60, ruleType: 'FIXED', amount: 5000 },
        { name: 'Performance Allowance', code: 'PA', category: 'ALLOWANCE', sequence: 70, ruleType: 'FIXED', amount: 3000 },
        { name: 'Provident Fund (PF)', code: 'PF', category: 'DEDUCTION', sequence: 80, ruleType: 'FORMULA', formula: 'BASIC * 0.12' },
        { name: 'Employee State Insurance (ESI)', code: 'ESI', category: 'DEDUCTION', sequence: 90, ruleType: 'FORMULA', formula: 'GROSS * 0.0075' },
        { name: 'Professional Tax', code: 'PT', category: 'DEDUCTION', sequence: 100, ruleType: 'FIXED', amount: 200 },
        { name: 'Income Tax', code: 'IT', category: 'DEDUCTION', sequence: 110, ruleType: 'FORMULA', formula: 'GROSS * 0.10' },
        { name: 'Net Salary', code: 'NET', category: 'NET', sequence: 999, ruleType: 'FORMULA', formula: '0' } // The engine handles net naturally
    ];

    for (const rule of rules1) {
        await prisma.salaryRule.upsert({
            where: { structureId_code: { structureId: struct1.id, code: rule.code } },
            update: rule,
            create: { ...rule, structureId: struct1.id }
        });
    }

    // 2. Executive Salary Structure
    const struct2 = await prisma.salaryStructure.upsert({
        where: { name: 'Executive Salary Structure' },
        update: {},
        create: {
            name: 'Executive Salary Structure',
            active: true
        }
    });

    const rules2 = [
        { name: 'Basic Pay', code: 'BASIC', category: 'BASIC', sequence: 10, ruleType: 'FORMULA', formula: 'WAGE * 0.60' },
        { name: 'HRA', code: 'HRA', category: 'ALLOWANCE', sequence: 20, ruleType: 'FORMULA', formula: 'BASIC * 0.25' },
        { name: 'Executive Allowance', code: 'EA', category: 'ALLOWANCE', sequence: 30, ruleType: 'FIXED', amount: 10000 },
        { name: 'Leadership Bonus', code: 'LB', category: 'ALLOWANCE', sequence: 40, ruleType: 'FIXED', amount: 7500 },
        { name: 'PF', code: 'PF', category: 'DEDUCTION', sequence: 50, ruleType: 'FORMULA', formula: 'BASIC * 0.12' },
        { name: 'Professional Tax', code: 'PT', category: 'DEDUCTION', sequence: 60, ruleType: 'FIXED', amount: 200 },
        { name: 'Income Tax', code: 'IT', category: 'DEDUCTION', sequence: 70, ruleType: 'FORMULA', formula: 'GROSS * 0.15' },
        { name: 'Net Salary', code: 'NET', category: 'NET', sequence: 999, ruleType: 'FORMULA', formula: '0' }
    ];

    for (const rule of rules2) {
        await prisma.salaryRule.upsert({
            where: { structureId_code: { structureId: struct2.id, code: rule.code } },
            update: rule,
            create: { ...rule, structureId: struct2.id }
        });
    }

    // 3. Intern Salary Structure
    const struct3 = await prisma.salaryStructure.upsert({
        where: { name: 'Intern Salary Structure' },
        update: {},
        create: {
            name: 'Intern Salary Structure',
            active: true
        }
    });

    const rules3 = [
        { name: 'Basic Stipend', code: 'STIPEND', category: 'BASIC', sequence: 10, ruleType: 'FORMULA', formula: 'WAGE' },
        { name: 'Intern Allowance', code: 'IA', category: 'ALLOWANCE', sequence: 20, ruleType: 'FIXED', amount: 1000 },
        { name: 'Transport Allowance', code: 'TA', category: 'ALLOWANCE', sequence: 30, ruleType: 'FIXED', amount: 500 },
        { name: 'TDS', code: 'TDS', category: 'DEDUCTION', sequence: 40, ruleType: 'FORMULA', formula: 'GROSS * 0.05' },
        { name: 'Other Deduction', code: 'OD', category: 'DEDUCTION', sequence: 50, ruleType: 'FIXED', amount: 100 },
        { name: 'Net Stipend', code: 'NET', category: 'NET', sequence: 999, ruleType: 'FORMULA', formula: '0' }
    ];

    for (const rule of rules3) {
        await prisma.salaryRule.upsert({
            where: { structureId_code: { structureId: struct3.id, code: rule.code } },
            update: rule,
            create: { ...rule, structureId: struct3.id }
        });
    }

    console.log('✅ Salary Structures and Rules seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
