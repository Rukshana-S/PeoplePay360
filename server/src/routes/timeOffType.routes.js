const express = require("express");
const router = express.Router();
const timeOffTypeController = require("../controllers/timeOffType.controller");

router.get("/", timeOffTypeController.getAll);
router.get("/:id", timeOffTypeController.getById);
router.post("/", timeOffTypeController.create);
router.put("/:id", timeOffTypeController.update);
router.delete("/:id", timeOffTypeController.remove);

module.exports = router;
