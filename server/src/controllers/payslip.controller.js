const asyncHandler = require("../utils/asyncHandler");
const payslipService = require("../services/payslip.service");

// @desc    Get all payslips
// @route   GET /api/payslips
const getAll = asyncHandler(async (req, res) => {
    const payslips = await payslipService.getAllPayslips(req.query);
    res.status(200).json({ success: true, count: payslips.length, data: payslips });
});

// @desc    Get single payslip
// @route   GET /api/payslips/:id
const getById = asyncHandler(async (req, res) => {
    const payslip = await payslipService.getPayslipById(req.params.id);
    res.status(200).json({ success: true, data: payslip });
});

module.exports = { getAll, getById };
