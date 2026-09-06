const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");
const { restrictTo } = require("../middlewares/auth");

// All roles can view attendance (EMPLOYEE sees own records via service)
router.get("/", attendanceController.getAll);

// EMPLOYEE can clock in/out for themselves; HR+ can clock for anyone
router.post("/check-in", attendanceController.checkIn);
router.post("/check-out", attendanceController.checkOut);

module.exports = router;
