const asyncHandler = require("../utils/asyncHandler");
const scheduleService = require("../services/schedule.service");

// @desc    Get all working schedules
// @route   GET /api/schedules
const getAll = asyncHandler(async (req, res) => {
    const schedules = await scheduleService.getAllSchedules();
    res.status(200).json({ success: true, data: schedules });
});

// @desc    Get single working schedule
// @route   GET /api/schedules/:id
const getById = asyncHandler(async (req, res) => {
    const schedule = await scheduleService.getScheduleById(req.params.id);
    res.status(200).json({ success: true, data: schedule });
});

// @desc    Create working schedule with days
// @route   POST /api/schedules
const create = asyncHandler(async (req, res) => {
    const schedule = await scheduleService.createSchedule(req.body);
    res.status(201).json({ success: true, data: schedule });
});

// @desc    Update working schedule
// @route   PUT /api/schedules/:id
const update = asyncHandler(async (req, res) => {
    const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
    res.status(200).json({ success: true, data: schedule });
});

// @desc    Delete working schedule
// @route   DELETE /api/schedules/:id
const remove = asyncHandler(async (req, res) => {
    await scheduleService.deleteSchedule(req.params.id);
    res.status(200).json({ success: true, message: "Working Schedule deleted" });
});

module.exports = { getAll, getById, create, update, remove };
