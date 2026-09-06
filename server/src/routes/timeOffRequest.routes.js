const express = require("express");
const router = express.Router();
const requestController = require("../controllers/timeOffRequest.controller");
const { restrictTo } = require("../middlewares/auth");

// All roles can view requests (EMPLOYEE sees own via service)
router.get("/", requestController.getAll);

// All roles can create a time-off request
router.post("/", requestController.create);

// Only HR Manager, HR Payroll User, HR Payroll Manager, Admin can approve/refuse
router.put("/:id/review", restrictTo("HR_MANAGER", "HR_PAYROLL_USER", "HR_PAYROLL_MANAGER", "ADMIN"), requestController.review);

module.exports = router;
