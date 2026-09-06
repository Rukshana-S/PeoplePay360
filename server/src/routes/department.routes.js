const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department.controller");
const { restrictTo } = require("../middlewares/auth");

// All authenticated users can view departments
router.get("/", departmentController.getAll);
router.get("/:id", departmentController.getById);

// Only Admin can CUD departments (master data)
router.post("/", restrictTo("ADMIN"), departmentController.create);
router.put("/:id", restrictTo("ADMIN"), departmentController.update);
router.delete("/:id", restrictTo("ADMIN"), departmentController.remove);

module.exports = router;