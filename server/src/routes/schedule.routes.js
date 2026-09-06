const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/schedule.controller");
const { restrictTo } = require("../middlewares/auth");

// All authenticated users can view schedules
router.get("/", scheduleController.getAll);
router.get("/:id", scheduleController.getById);

// Only HR Manager, HR Payroll Manager, Admin can CUD working schedules
router.post("/", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), scheduleController.create);
router.put("/:id", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), scheduleController.update);
router.delete("/:id", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), scheduleController.remove);

module.exports = router;
