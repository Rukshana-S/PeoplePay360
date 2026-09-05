const express = require("express");
const router = express.Router();
const payrunController = require("../controllers/payrun.controller");

router.get("/", payrunController.getAll);
router.get("/:id", payrunController.getById);
router.post("/", payrunController.execute);
router.delete("/:id", payrunController.remove);

module.exports = router;
