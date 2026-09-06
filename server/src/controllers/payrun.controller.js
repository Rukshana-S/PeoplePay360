const asyncHandler = require("../utils/asyncHandler");
const payrunService = require("../services/payrun.service");

// @desc    Get all payruns
// @route   GET /api/payruns
const getAll = asyncHandler(async (req, res) => {
    const payruns = await payrunService.getAllPayruns();
    res.status(200).json({ success: true, count: payruns.length, data: payruns });
});

// @desc    Get single payrun with payslip summaries
// @route   GET /api/payruns/:id
const getById = asyncHandler(async (req, res) => {
    const payrun = await payrunService.getPayrunById(req.params.id);
    res.status(200).json({ success: true, data: payrun });
});

// @desc    Execute a new payrun batch (The Payroll Engine)
// @route   POST /api/payruns
const execute = asyncHandler(async (req, res) => {
    const payrun = await payrunService.executePayrun(req.body);
    res.status(201).json({ success: true, message: "Payroll executed successfully", data: payrun });
});

// @desc    Update payrun status (Validate, Mark Paid)
// @route   PUT /api/payruns/:id/status
const updateStatus = asyncHandler(async (req, res) => {
    const payrun = await payrunService.updatePayrunStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, message: `Payrun updated to ${req.body.status}`, data: payrun });
});

// @desc    Recompute a Draft/Computed Payrun
// @route   POST /api/payruns/:id/recompute
const recompute = asyncHandler(async (req, res) => {
    const payrun = await payrunService.recomputePayrun(req.params.id);
    res.status(200).json({ success: true, message: "Payrun recomputed successfully", data: payrun });
});

// @desc    Send Payslips to Employees (Mock)
// @route   POST /api/payruns/:id/send
const sendPayslips = asyncHandler(async (req, res) => {
    // In a real system, this would trigger email sending via SendGrid/AWS SES.
    res.status(200).json({ success: true, message: "Payslips sent to employees successfully" });
});

// @desc    Delete a payrun
// @route   DELETE /api/payruns/:id
const remove = asyncHandler(async (req, res) => {
    await payrunService.deletePayrun(req.params.id);
    res.status(200).json({ success: true, message: "Payrun deleted successfully" });
});

module.exports = { getAll, getById, execute, remove, updateStatus, recompute, sendPayslips };
