const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { bookAppointment, getAppointments, updateAppointment, deleteAppointment } = require("../controllers/appointmentController");

router.use(authMiddleware);

router.post("/", roleMiddleware(["Admin", "Doctor", "Patient"]), bookAppointment);
router.get("/:doctor_id?", roleMiddleware(["Admin", "Doctor", "Nurse", "Patient"]), getAppointments);
router.put("/:id", roleMiddleware(["Admin", "Doctor"]), updateAppointment);
router.delete("/:id", roleMiddleware(["Admin"]), deleteAppointment);

module.exports = router;
