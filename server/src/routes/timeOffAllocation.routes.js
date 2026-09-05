const express = require("express");
const router = express.Router();
const allocationController = require("../controllers/timeOffAllocation.controller");

router.get("/", allocationController.getAll);
router.post("/", allocationController.create);

module.exports = router;
