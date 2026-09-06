const express = require("express");
const router = express.Router();
const payslipController = require("../controllers/payslip.controller");
const { restrictTo } = require("../middlewares/auth");

// EMPLOYEE can view own payslips (service-layer filter), payroll roles see all
router.get("/", payslipController.getAll);
router.get("/:id", payslipController.getById);

module.exports = router;
