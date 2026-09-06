const express = require("express");
const router = express.Router();
const allocationController = require("../controllers/timeOffAllocation.controller");
const { restrictTo } = require("../middlewares/auth");

// All authenticated users can view allocations (EMPLOYEE sees own via service)
router.get("/", allocationController.getAll);

// Only HR Manager, HR Payroll User, HR Payroll Manager, Admin can create or delete allocations
router.post("/", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), allocationController.create);
router.delete("/:id", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), allocationController.remove);

module.exports = router;
