const asyncHandler = require("../utils/asyncHandler");
const timeOffTypeService = require("../services/timeOffType.service");

// @desc    Get all time off types
// @route   GET /api/time-off-types
const getAll = asyncHandler(async (req, res) => {
    const types = await timeOffTypeService.getAllTimeOffTypes();
    res.status(200).json({ success: true, data: types });
});

// @desc    Get single time off type
// @route   GET /api/time-off-types/:id
const getById = asyncHandler(async (req, res) => {
    const type = await timeOffTypeService.getTimeOffTypeById(req.params.id);
    res.status(200).json({ success: true, data: type });
});

// @desc    Create time off type
// @route   POST /api/time-off-types
const create = asyncHandler(async (req, res) => {
    const type = await timeOffTypeService.createTimeOffType(req.body);
    res.status(201).json({ success: true, data: type });
});

// @desc    Update time off type
// @route   PUT /api/time-off-types/:id
const update = asyncHandler(async (req, res) => {
    const type = await timeOffTypeService.updateTimeOffType(req.params.id, req.body);
    res.status(200).json({ success: true, data: type });
});

// @desc    Delete time off type
// @route   DELETE /api/time-off-types/:id
const remove = asyncHandler(async (req, res) => {
    await timeOffTypeService.deleteTimeOffType(req.params.id);
    res.status(200).json({ success: true, message: "Time Off Type deleted" });
});

module.exports = { getAll, getById, create, update, remove };
