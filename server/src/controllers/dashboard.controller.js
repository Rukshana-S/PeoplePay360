const asyncHandler = require("../utils/asyncHandler");
const dashboardService = require("../services/dashboard.service");

// @desc    Get dashboard aggregated statistics
// @route   GET /api/dashboard
const getStats = asyncHandler(async (req, res) => {
    const stats = await dashboardService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
});

module.exports = { getStats };
