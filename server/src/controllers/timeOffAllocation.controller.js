const asyncHandler = require("../utils/asyncHandler");
const allocationService = require("../services/timeOffAllocation.service");

// @desc    Get all allocations
// @route   GET /api/time-off-allocations
const getAll = asyncHandler(async (req, res) => {
    const allocations = await allocationService.getAllAllocations(req.query);
    res.status(200).json({ success: true, count: allocations.length, data: allocations });
});

// @desc    Allocate days
// @route   POST /api/time-off-allocations
const create = asyncHandler(async (req, res) => {
    const allocation = await allocationService.allocateDays(req.body);
    res.status(201).json({ success: true, data: allocation });
});

module.exports = { getAll, create };
