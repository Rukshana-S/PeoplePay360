const asyncHandler = require("../utils/asyncHandler");
const jobPositionService = require("../services/jobPosition.service");

// @desc    Get all job positions
// @route   GET /api/job-positions
const getAll = asyncHandler(async (req, res) => {
    const positions = await jobPositionService.getAllJobPositions();
    res.status(200).json({ success: true, data: positions });
});

// @desc    Get single job position
// @route   GET /api/job-positions/:id
const getById = asyncHandler(async (req, res) => {
    const position = await jobPositionService.getJobPositionById(req.params.id);
    res.status(200).json({ success: true, data: position });
});

// @desc    Create job position
// @route   POST /api/job-positions
const create = asyncHandler(async (req, res) => {
    const position = await jobPositionService.createJobPosition(req.body);
    res.status(201).json({ success: true, data: position });
});

// @desc    Update job position
// @route   PUT /api/job-positions/:id
const update = asyncHandler(async (req, res) => {
    const position = await jobPositionService.updateJobPosition(req.params.id, req.body);
    res.status(200).json({ success: true, data: position });
});

// @desc    Delete job position
// @route   DELETE /api/job-positions/:id
const remove = asyncHandler(async (req, res) => {
    await jobPositionService.deleteJobPosition(req.params.id);
    res.status(200).json({ success: true, message: "Job Position deleted" });
});

module.exports = { getAll, getById, create, update, remove };
