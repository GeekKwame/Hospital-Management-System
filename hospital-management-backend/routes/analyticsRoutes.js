const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getSummary, getAppointmentTrends, getRoomOccupancy } = require("../controllers/analyticsController");

router.use(authMiddleware, roleMiddleware(["Admin", "Doctor", "Nurse"]));

router.get("/summary", getSummary);
router.get("/appointments/trends", getAppointmentTrends);
router.get("/rooms", getRoomOccupancy);

module.exports = router;

