const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contract.controller");

router.get("/", contractController.getAll);
router.get("/:id", contractController.getById);
router.post("/", contractController.create);
router.put("/:id", contractController.update);
router.delete("/:id", contractController.remove);

module.exports = router;
