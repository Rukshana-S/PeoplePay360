const asyncHandler = require("../utils/asyncHandler");
const requestService = require("../services/timeOffRequest.service");

// @desc    Get all time off requests
// @route   GET /api/time-off-requests
const getAll = asyncHandler(async (req, res) => {
    const requests = await requestService.getAllRequests(req.query);
    res.status(200).json({ success: true, count: requests.length, data: requests });
});

// @desc    Submit a time off request
// @route   POST /api/time-off-requests
const create = asyncHandler(async (req, res) => {
    const request = await requestService.requestTimeOff(req.body);
    res.status(201).json({ success: true, data: request });
});

// @desc    Review (Approve/Reject) a time off request
// @route   PUT /api/time-off-requests/:id/review
const review = asyncHandler(async (req, res) => {
    const request = await requestService.reviewRequest(req.params.id, req.body);
    res.status(200).json({ success: true, data: request });
});

module.exports = { getAll, create, review };
