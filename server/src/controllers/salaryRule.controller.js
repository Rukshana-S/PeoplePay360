const asyncHandler = require("../utils/asyncHandler");
const salaryRuleService = require("../services/salaryRule.service");

// @desc    Get all salary rules
// @route   GET /api/salary-rules?structureId=
const getAll = asyncHandler(async (req, res) => {
    const rules = await salaryRuleService.getAllRules(req.query);
    res.status(200).json({ success: true, count: rules.length, data: rules });
});

// @desc    Get single salary rule
// @route   GET /api/salary-rules/:id
const getById = asyncHandler(async (req, res) => {
    const rule = await salaryRuleService.getRuleById(req.params.id);
    res.status(200).json({ success: true, data: rule });
});

// @desc    Create salary rule
// @route   POST /api/salary-rules
const create = asyncHandler(async (req, res) => {
    const rule = await salaryRuleService.createRule(req.body);
    res.status(201).json({ success: true, data: rule });
});

// @desc    Update salary rule
// @route   PUT /api/salary-rules/:id
const update = asyncHandler(async (req, res) => {
    const rule = await salaryRuleService.updateRule(req.params.id, req.body);
    res.status(200).json({ success: true, data: rule });
});

// @desc    Delete salary rule
// @route   DELETE /api/salary-rules/:id
const remove = asyncHandler(async (req, res) => {
    await salaryRuleService.deleteRule(req.params.id);
    res.status(200).json({ success: true, message: "Salary Rule deleted" });
});

module.exports = { getAll, getById, create, update, remove };
