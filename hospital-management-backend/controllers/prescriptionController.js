const Prescription = require("../models/Prescription");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { logAction } = require("../utils/auditLogger");

exports.createPrescription = async (req, res) => {
  try {
    const { doctor_id, patient_id, appointment_id, medication, dosage, frequency, duration, instructions } = req.body;

    if (!doctor_id || !patient_id || !medication || !dosage || !frequency || !duration) {
      return res.status(400).json({ message: "doctor_id, patient_id, medication, dosage, frequency, and duration are required" });
    }

    const doctorId = Number(doctor_id);
    const patientId = Number(patient_id);

    if (Number.isNaN(doctorId) || Number.isNaN(patientId)) {
      return res.status(400).json({ message: "doctor_id and patient_id must be numbers" });
    }

    const [doctor, patient] = await Promise.all([
      User.findByPk(doctorId),
      User.findByPk(patientId)
    ]);

    if (!doctor || doctor.role !== "Doctor") {
      return res.status(400).json({ message: "Invalid doctor_id" });
    }

    if (!patient || patient.role !== "Patient") {
      return res.status(400).json({ message: "Invalid patient_id" });
    }

    // Verify appointment if provided
    if (appointment_id) {
      const appointment = await Appointment.findByPk(appointment_id);
      if (!appointment) {
        return res.status(400).json({ message: "Invalid appointment_id" });
      }
      if (appointment.doctor_id !== doctorId || appointment.patient_id !== patientId) {
        return res.status(400).json({ message: "Appointment does not match doctor and patient" });
      }
    }

    const prescription = await Prescription.create({
      doctor_id: doctorId,
      patient_id: patientId,
      appointment_id: appointment_id || null,
      medication,
      dosage,
      frequency,
      duration,
      instructions: instructions || null
    });

    await logAction({
      userId: req.user?.user_id,
      action: "PRESCRIPTION_CREATED",
      resource: "Prescription",
      details: { prescription_id: prescription.prescription_id }
    });

    const createdPrescription = await Prescription.findByPk(prescription.prescription_id, {
      include: [
        { model: User, as: "doctor", attributes: ["user_id", "first_name", "last_name", "email"] },
        { model: User, as: "patient", attributes: ["user_id", "first_name", "last_name", "email"] }
      ]
    });

    res.status(201).json(createdPrescription);
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ message: "Error creating prescription" });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const { patient_id, doctor_id, status } = req.query;

    const filters = {};

    if (patient_id) {
      const parsedPatientId = Number(patient_id);
      if (Number.isNaN(parsedPatientId)) {
        return res.status(400).json({ message: "patient_id must be a number" });
      }
      filters.patient_id = parsedPatientId;
    }

    if (doctor_id) {
      const parsedDoctorId = Number(doctor_id);
      if (Number.isNaN(parsedDoctorId)) {
        return res.status(400).json({ message: "doctor_id must be a number" });
      }
      filters.doctor_id = parsedDoctorId;
    }

    if (status) {
      filters.status = status;
    }

    // If user is a patient, only show their prescriptions
    if (req.user.role === "Patient") {
      filters.patient_id = req.user.user_id;
    }

    // If user is a doctor, only show their prescriptions
    if (req.user.role === "Doctor" && !doctor_id) {
      filters.doctor_id = req.user.user_id;
    }

    const prescriptions = await Prescription.findAll({
      where: filters,
      include: [
        { model: User, as: "doctor", attributes: ["user_id", "first_name", "last_name", "email"] },
        { model: User, as: "patient", attributes: ["user_id", "first_name", "last_name", "email"] },
        { model: Appointment, as: "appointment", attributes: ["appointment_id", "scheduled_at", "reason"], required: false }
      ],
      order: [["prescribed_date", "DESC"]]
    });

    res.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Error fetching prescriptions" });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findByPk(id, {
      include: [
        { model: User, as: "doctor", attributes: ["user_id", "first_name", "last_name", "email"] },
        { model: User, as: "patient", attributes: ["user_id", "first_name", "last_name", "email"] },
        { model: Appointment, as: "appointment", attributes: ["appointment_id", "scheduled_at", "reason"], required: false }
      ]
    });

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Check permissions
    if (req.user.role === "Patient" && prescription.patient_id !== req.user.user_id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.role === "Doctor" && prescription.doctor_id !== req.user.user_id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(prescription);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({ message: "Error fetching prescription" });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    const prescription = await Prescription.findByPk(id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Check permissions
    if (req.user.role === "Doctor" && prescription.doctor_id !== req.user.user_id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate doctor_id if provided
    if (payload.doctor_id) {
      const parsedDoctor = Number(payload.doctor_id);
      if (Number.isNaN(parsedDoctor)) {
        return res.status(400).json({ message: "doctor_id must be a number" });
      }
      const doctor = await User.findByPk(parsedDoctor);
      if (!doctor || doctor.role !== "Doctor") {
        return res.status(400).json({ message: "Invalid doctor_id" });
      }
      payload.doctor_id = parsedDoctor;
    }

    // Validate patient_id if provided
    if (payload.patient_id) {
      const parsedPatient = Number(payload.patient_id);
      if (Number.isNaN(parsedPatient)) {
        return res.status(400).json({ message: "patient_id must be a number" });
      }
      const patient = await User.findByPk(parsedPatient);
      if (!patient || patient.role !== "Patient") {
        return res.status(400).json({ message: "Invalid patient_id" });
      }
      payload.patient_id = parsedPatient;
    }

    const [updatedCount, updatedRows] = await Prescription.update(payload, {
      where: { prescription_id: id },
      returning: true
    });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    await logAction({
      userId: req.user?.user_id,
      action: "PRESCRIPTION_UPDATED",
      resource: "Prescription",
      details: { prescription_id: id, changes: payload }
    });

    const updatedPrescription = await Prescription.findByPk(id, {
      include: [
        { model: User, as: "doctor", attributes: ["user_id", "first_name", "last_name", "email"] },
        { model: User, as: "patient", attributes: ["user_id", "first_name", "last_name", "email"] }
      ]
    });

    res.json(updatedPrescription);
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ message: "Error updating prescription" });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findByPk(id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Check permissions - only Admin or the prescribing doctor can delete
    if (req.user.role !== "Admin" && prescription.doctor_id !== req.user.user_id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Prescription.destroy({ where: { prescription_id: id } });

    await logAction({
      userId: req.user?.user_id,
      action: "PRESCRIPTION_DELETED",
      resource: "Prescription",
      details: { prescription_id: id }
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting prescription:", error);
    res.status(500).json({ message: "Error deleting prescription" });
  }
};

