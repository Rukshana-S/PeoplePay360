const express = require("express");
const router = express.Router();
const jobPositionController = require("../controllers/jobPosition.controller");

router.get("/", jobPositionController.getAll);
router.get("/:id", jobPositionController.getById);
router.post("/", jobPositionController.create);
router.put("/:id", jobPositionController.update);
router.delete("/:id", jobPositionController.remove);

module.exports = router;
