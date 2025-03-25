const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getDoctors, getPatients, updateUser, deleteUser } = require("../controllers/userController");

router.get("/doctors", authMiddleware, roleMiddleware(["Admin", "Doctor"]), getDoctors);
router.get("/patients", authMiddleware, roleMiddleware(["Admin", "Doctor"]), getPatients);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
