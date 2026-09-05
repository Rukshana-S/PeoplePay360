const express = require("express");
const router = express.Router();
const payslipController = require("../controllers/payslip.controller");

router.get("/", payslipController.getAll);
router.get("/:id", payslipController.getById);

module.exports = router;
