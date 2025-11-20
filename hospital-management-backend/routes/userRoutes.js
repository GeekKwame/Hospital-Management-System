const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getDoctors, getPatients, updateUser, deleteUser } = require("../controllers/userController");

router.use(authMiddleware);

router.get("/doctors", roleMiddleware(["Admin", "Doctor", "Nurse"]), getDoctors);
router.get("/patients", roleMiddleware(["Admin", "Doctor", "Nurse"]), getPatients);
router.put("/:id", roleMiddleware(["Admin"]), updateUser);
router.delete("/:id", roleMiddleware(["Admin"]), deleteUser);

module.exports = router;
