const express = require("express");
const router = express.Router();
const salaryStructureController = require("../controllers/salaryStructure.controller");

router.get("/", salaryStructureController.getAll);
router.get("/:id", salaryStructureController.getById);
router.post("/", salaryStructureController.create);
router.put("/:id", salaryStructureController.update);
router.delete("/:id", salaryStructureController.remove);

module.exports = router;
