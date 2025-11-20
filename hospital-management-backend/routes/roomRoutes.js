const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getRooms, updateRoom, admitPatient, dischargePatient } = require("../controllers/roomController");

router.use(authMiddleware);

router.get("/", roleMiddleware(["Admin", "Doctor", "Nurse"]), getRooms);
router.patch("/:id", roleMiddleware(["Admin", "Nurse"]), updateRoom);
router.post("/admissions", roleMiddleware(["Admin", "Nurse"]), admitPatient);
router.patch("/admissions/:id", roleMiddleware(["Admin", "Nurse"]), dischargePatient);

module.exports = router;
