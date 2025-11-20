const express = require("express");
const { register, login, requestPasswordReset, resetPassword } = require("./controllers/authController");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const roomRoutes = require("./routes/roomRoutes");
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const admissionRoutes = require("./routes/admissionRoutes");

const router = express.Router();

// Auth Routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/request-reset", requestPasswordReset);
router.post("/auth/reset-password", resetPassword);

router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/rooms", roomRoutes);
router.use("/admin", adminRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/admissions", admissionRoutes);

module.exports = router;
