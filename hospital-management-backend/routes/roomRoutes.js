const express = require("express");
const router = express.Router();
const { getRooms, updateRoom, admitPatient, dischargePatient } = require("../controllers/roomController");

router.get("/", getRooms);
router.patch("/:id", updateRoom);
router.post("/admissions", admitPatient);
router.patch("/admissions/:id", dischargePatient);

module.exports = router;
