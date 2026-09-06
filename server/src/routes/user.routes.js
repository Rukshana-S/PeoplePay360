const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { restrictTo } = require("../middlewares/auth");

// Only Admin can manage system users
router.get("/", restrictTo("ADMIN"), userController.getAll);
router.get("/:id", restrictTo("ADMIN"), userController.getById);
router.post("/", restrictTo("ADMIN"), userController.create);
router.put("/:id", restrictTo("ADMIN"), userController.update);
router.delete("/:id", restrictTo("ADMIN"), userController.remove);

module.exports = router;
