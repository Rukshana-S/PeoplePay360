const asyncHandler = require("../utils/asyncHandler");
const attendanceService = require("../services/attendance.service");

// @desc    Get all attendance records
// @route   GET /api/attendance
const getAll = asyncHandler(async (req, res) => {
    const records = await attendanceService.getAttendance(req.query, req.user);
    res.status(200).json({ success: true, count: records.length, data: records });
});

// @desc    Check-In an employee
// @route   POST /api/attendance/check-in
const checkIn = asyncHandler(async (req, res) => {
    const record = await attendanceService.checkIn(req.body.employeeId, req.user);
    res.status(201).json({ success: true, message: "Checked in successfully", data: record });
});

// @desc    Check-Out an employee
// @route   POST /api/attendance/check-out
const checkOut = asyncHandler(async (req, res) => {
    const record = await attendanceService.checkOut(req.body.employeeId, req.user);
    res.status(200).json({ success: true, message: "Checked out successfully", data: record });
});

module.exports = { getAll, checkIn, checkOut };
