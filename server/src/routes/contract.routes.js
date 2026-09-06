const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contract.controller");
const { restrictTo } = require("../middlewares/auth");

// HR Payroll User can only VIEW contracts
router.get("/", contractController.getAll);
router.get("/:id", contractController.getById);

// Only HR Manager, HR Payroll Manager, Admin can CUD contracts
router.post("/", restrictTo("HR_MANAGER", "HR_PAYROLL_MANAGER", "ADMIN"), contractController.create);
router.put("/:id", restrictTo("HR_MANAGER", "HR_PAYROLL_MANAGER", "ADMIN"), contractController.update);
router.delete("/:id", restrictTo("HR_MANAGER", "HR_PAYROLL_MANAGER", "ADMIN"), contractController.remove);

module.exports = router;
