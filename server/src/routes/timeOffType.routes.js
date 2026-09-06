const express = require("express");
const router = express.Router();
const timeOffTypeController = require("../controllers/timeOffType.controller");
const { restrictTo } = require("../middlewares/auth");

// All authenticated users can view time-off types
router.get("/", timeOffTypeController.getAll);
router.get("/:id", timeOffTypeController.getById);

// Only Admin can CUD time-off types (master data)
router.post("/", restrictTo("ADMIN"), timeOffTypeController.create);
router.put("/:id", restrictTo("ADMIN"), timeOffTypeController.update);
router.delete("/:id", restrictTo("ADMIN"), timeOffTypeController.remove);

module.exports = router;
