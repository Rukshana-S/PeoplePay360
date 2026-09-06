const express = require("express");
const router = express.Router();
const salaryStructureController = require("../controllers/salaryStructure.controller");
const { restrictTo } = require("../middlewares/auth");

// HR Payroll User has READ-ONLY; HR Payroll Manager & Admin have full CRUD
// HR Manager has READ-ONLY to create contracts
router.get("/", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), salaryStructureController.getAll);
router.get("/:id", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), salaryStructureController.getById);

router.post("/", restrictTo("HR_PAYROLL_MANAGER", "ADMIN"), salaryStructureController.create);
router.put("/:id", restrictTo("HR_PAYROLL_MANAGER", "ADMIN"), salaryStructureController.update);
router.delete("/:id", restrictTo("HR_PAYROLL_MANAGER", "ADMIN"), salaryStructureController.remove);

module.exports = router;
