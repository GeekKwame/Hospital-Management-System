const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { logAction } = require("../utils/auditLogger");

exports.bookAppointment = async (req, res) => {
  try {
    const { doctor_id, patient_id, scheduled_at, reason, notes } = req.body;

    const doctorId = Number(doctor_id);
    const patientId = Number(patient_id);

    if (!doctor_id || !patient_id || !scheduled_at) {
      return res.status(400).json({ message: "doctor_id, patient_id and scheduled_at are required" });
    }

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

    const scheduledDate = new Date(scheduled_at);
    if (Number.isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ message: "scheduled_at must be a valid date" });
    }

    const appointment = await Appointment.create({
      doctor_id: doctorId,
      patient_id: patientId,
      scheduled_at: scheduledDate,
      reason,
      notes
    });

    await logAction({
      userId: req.user?.user_id,
      action: "APPOINTMENT_CREATED",
      resource: "Appointment",
      details: { appointment_id: appointment.appointment_id }
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment" });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const { patient_id, status } = req.query;

    const filters = {};

    if (doctor_id) {
      const parsedDoctorId = Number(doctor_id);
      if (Number.isNaN(parsedDoctorId)) {
        return res.status(400).json({ message: "doctor_id must be a number" });
      }
      filters.doctor_id = parsedDoctorId;
    }

    if (patient_id) {
      const parsedPatientId = Number(patient_id);
      if (Number.isNaN(parsedPatientId)) {
        return res.status(400).json({ message: "patient_id must be a number" });
      }
      filters.patient_id = parsedPatientId;
    }

    if (status) {
      filters.status = status;
    }

    const appointments = await Appointment.findAll({
      where: filters,
      order: [["scheduled_at", "ASC"]]
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(payload, "doctor_id")) {
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

    if (Object.prototype.hasOwnProperty.call(payload, "patient_id")) {
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

    if (payload.scheduled_at) {
      const scheduledDate = new Date(payload.scheduled_at);
      if (Number.isNaN(scheduledDate.getTime())) {
        return res.status(400).json({ message: "scheduled_at must be a valid date" });
      }
      payload.scheduled_at = scheduledDate;
    }

    const [updatedCount, updatedRows] = await Appointment.update(payload, {
      where: { appointment_id: id },
      returning: true
    });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await logAction({
      userId: req.user?.user_id,
      action: "APPOINTMENT_UPDATED",
      resource: "Appointment",
      details: { appointment_id: id, changes: payload }
    });

    res.json(updatedRows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Appointment.destroy({ where: { appointment_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await logAction({
      userId: req.user?.user_id,
      action: "APPOINTMENT_DELETED",
      resource: "Appointment",
      details: { appointment_id: id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment" });
  }
};
