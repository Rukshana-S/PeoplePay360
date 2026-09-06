const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const { restrictTo } = require("../middlewares/auth");

// All authenticated users can view employees (EMPLOYEE sees own via service-layer filter)
router.get("/", employeeController.getAll);
router.get("/:id", employeeController.getById);

// Only HR Manager, HR Payroll User, HR Payroll Manager, Admin can CUD
router.post("/", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), employeeController.create);
router.put("/:id", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), employeeController.update);
router.delete("/:id", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), employeeController.remove);

module.exports = router;
