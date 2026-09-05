const express = require("express");
const router = express.Router();
const requestController = require("../controllers/timeOffRequest.controller");

router.get("/", requestController.getAll);
router.post("/", requestController.create);
router.put("/:id/review", requestController.review);

module.exports = router;
