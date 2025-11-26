const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription
} = require("../controllers/prescriptionController");

router.use(authMiddleware);

router.post("/", roleMiddleware(["Admin", "Doctor"]), createPrescription);
router.get("/", roleMiddleware(["Admin", "Doctor", "Nurse", "Patient"]), getPrescriptions);
router.get("/:id", roleMiddleware(["Admin", "Doctor", "Nurse", "Patient"]), getPrescriptionById);
router.put("/:id", roleMiddleware(["Admin", "Doctor"]), updatePrescription);
router.delete("/:id", roleMiddleware(["Admin", "Doctor"]), deletePrescription);

module.exports = router;

