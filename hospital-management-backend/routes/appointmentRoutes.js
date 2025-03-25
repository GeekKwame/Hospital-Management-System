const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { bookAppointment, getAppointments, updateAppointment, deleteAppointment } = require("../controllers/appointmentController");

router.post("/", authMiddleware, bookAppointment);
router.get("/:doctor_id", authMiddleware, getAppointments);
router.put("/:id", authMiddleware, updateAppointment);
router.delete("/:id", authMiddleware, deleteAppointment);

module.exports = router;
