const express = require("express");
const router = express.Router();
const payrunController = require("../controllers/payrun.controller");
const { restrictTo } = require("../middlewares/auth");

// Only payroll roles + admin can access payruns at all
router.get("/", restrictTo("HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), payrunController.getAll);
router.get("/:id", restrictTo("HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), payrunController.getById);
router.post("/", restrictTo("HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), payrunController.execute);
router.put("/:id/status", restrictTo("HR_PAYROLL_MANAGER", "ADMIN"), payrunController.updateStatus);
router.post("/:id/recompute", restrictTo("HR_PAYROLL_MANAGER", "ADMIN"), payrunController.recompute);
router.post("/:id/send", restrictTo("HR_PAYROLL_MANAGER", "ADMIN"), payrunController.sendPayslips);

// Only HR Payroll Manager and Admin can delete payruns
router.delete("/:id", restrictTo("HR_PAYROLL_MANAGER", "ADMIN"), payrunController.remove);

module.exports = router;
