const asyncHandler = require("../utils/asyncHandler");
const salaryStructureService = require("../services/salaryStructure.service");

// @desc    Get all salary structures
// @route   GET /api/salary-structures
const getAll = asyncHandler(async (req, res) => {
    const structures = await salaryStructureService.getAllStructures();
    res.status(200).json({ success: true, count: structures.length, data: structures });
});

// @desc    Get single salary structure with rules
// @route   GET /api/salary-structures/:id
const getById = asyncHandler(async (req, res) => {
    const structure = await salaryStructureService.getStructureById(req.params.id);
    res.status(200).json({ success: true, data: structure });
});

// @desc    Create salary structure
// @route   POST /api/salary-structures
const create = asyncHandler(async (req, res) => {
    const structure = await salaryStructureService.createStructure(req.body);
    res.status(201).json({ success: true, data: structure });
});

// @desc    Update salary structure
// @route   PUT /api/salary-structures/:id
const update = asyncHandler(async (req, res) => {
    const structure = await salaryStructureService.updateStructure(req.params.id, req.body);
    res.status(200).json({ success: true, data: structure });
});

// @desc    Delete salary structure
// @route   DELETE /api/salary-structures/:id
const remove = asyncHandler(async (req, res) => {
    await salaryStructureService.deleteStructure(req.params.id);
    res.status(200).json({ success: true, message: "Salary Structure deleted" });
});

module.exports = { getAll, getById, create, update, remove };
