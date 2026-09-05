const prisma = require("../config/db");

// GET all salary rules (with optional filter by structureId)
const getAllRules = async (query) => {
    const where = {};
    if (query.structureId) where.structureId = query.structureId;

    return await prisma.salaryRule.findMany({
        where,
        include: {
            structure: { select: { id: true, name: true } }
        },
        orderBy: { sequence: "asc" }
    });
};

// GET single salary rule by ID
const getRuleById = async (id) => {
    const rule = await prisma.salaryRule.findUnique({
        where: { id },
        include: {
            structure: { select: { id: true, name: true } }
        }
    });
    if (!rule) throw new Error("Salary Rule not found");
    return rule;
};

// CREATE a new salary rule
const createRule = async (data) => {
    // Business Rule: FIXED and PERCENTAGE rules must have an amount
    if ((data.ruleType === "FIXED" || data.ruleType === "PERCENTAGE") && !data.amount && data.amount !== 0) {
        throw new Error(`Salary rules of type ${data.ruleType} must have an amount value`);
    }

    // Business Rule: Check that the structure exists
    const structure = await prisma.salaryStructure.findUnique({
        where: { id: data.structureId }
    });
    if (!structure) throw new Error("Salary Structure not found");

    // Business Rule: Check for duplicate sequence in same structure
    const existingSequence = await prisma.salaryRule.findFirst({
        where: { structureId: data.structureId, sequence: data.sequence }
    });
    if (existingSequence) {
        throw new Error(`Sequence ${data.sequence} already exists in this structure. Each rule must have a unique sequence number.`);
    }

    return await prisma.salaryRule.create({
        data: {
            structureId: data.structureId,
            code: data.code,
            category: data.category,
            sequence: data.sequence,
            ruleType: data.ruleType,
            amount: data.amount || null,
        },
        include: {
            structure: { select: { id: true, name: true } }
        }
    });
};

// UPDATE a salary rule
const updateRule = async (id, data) => {
    const existing = await getRuleById(id);

    // Business Rule: If changing ruleType, validate amount
    const ruleType = data.ruleType || existing.ruleType;
    const amount = data.amount !== undefined ? data.amount : existing.amount;
    if ((ruleType === "FIXED" || ruleType === "PERCENTAGE") && !amount && amount !== 0) {
        throw new Error(`Salary rules of type ${ruleType} must have an amount value`);
    }

    // Business Rule: If changing sequence, check for duplicates
    if (data.sequence && data.sequence !== existing.sequence) {
        const structureId = data.structureId || existing.structureId;
        const existingSequence = await prisma.salaryRule.findFirst({
            where: { structureId, sequence: data.sequence, id: { not: id } }
        });
        if (existingSequence) {
            throw new Error(`Sequence ${data.sequence} already exists in this structure.`);
        }
    }

    const updateData = {};
    if (data.code) updateData.code = data.code;
    if (data.category) updateData.category = data.category;
    if (data.sequence) updateData.sequence = data.sequence;
    if (data.ruleType) updateData.ruleType = data.ruleType;
    if (data.amount !== undefined) updateData.amount = data.amount;

    return await prisma.salaryRule.update({
        where: { id },
        data: updateData,
        include: {
            structure: { select: { id: true, name: true } }
        }
    });
};

// DELETE a salary rule
const deleteRule = async (id) => {
    await getRuleById(id);
    return await prisma.salaryRule.delete({ where: { id } });
};

module.exports = {
    getAllRules,
    getRuleById,
    createRule,
    updateRule,
    deleteRule
};
