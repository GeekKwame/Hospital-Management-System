const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getAdmissions, updateAdmissionStatus } = require("../controllers/admissionController");

router.use(authMiddleware, roleMiddleware(["Admin", "Nurse"]));

router.get("/", getAdmissions);
router.patch("/:id/status", updateAdmissionStatus);

module.exports = router;

