const express = require("express");
const router = express.Router();
const jobPositionController = require("../controllers/jobPosition.controller");
const { restrictTo } = require("../middlewares/auth");

// All authenticated users can view job positions
router.get("/", jobPositionController.getAll);
router.get("/:id", jobPositionController.getById);

// Only Admin can CUD job positions (master data)
router.post("/", restrictTo("ADMIN"), jobPositionController.create);
router.put("/:id", restrictTo("ADMIN"), jobPositionController.update);
router.delete("/:id", restrictTo("ADMIN"), jobPositionController.remove);

module.exports = router;
