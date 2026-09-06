const express = require("express");
const router = express.Router();
const salaryRuleController = require("../controllers/salaryRule.controller");
const { restrictTo } = require("../middlewares/auth");

// HR Payroll User & HR Manager have READ-ONLY; HR Payroll Manager & Admin have full CRUD
router.get("/", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), salaryRuleController.getAll);
router.get("/:id", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), salaryRuleController.getById);

router.post("/", restrictTo("HR_PAYROLL_MANAGER", "ADMIN"), salaryRuleController.create);
router.put("/:id", restrictTo("HR_PAYROLL_MANAGER", "ADMIN"), salaryRuleController.update);
router.delete("/:id", restrictTo("HR_PAYROLL_MANAGER", "ADMIN"), salaryRuleController.remove);

module.exports = router;
