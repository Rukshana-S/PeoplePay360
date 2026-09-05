const express = require("express");
const router = express.Router();
const salaryRuleController = require("../controllers/salaryRule.controller");

router.get("/", salaryRuleController.getAll);
router.get("/:id", salaryRuleController.getById);
router.post("/", salaryRuleController.create);
router.put("/:id", salaryRuleController.update);
router.delete("/:id", salaryRuleController.remove);

module.exports = router;
