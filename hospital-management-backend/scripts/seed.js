require("dotenv").config();

const bcrypt = require("bcryptjs");
const sequelize = require("../db");
const { User, Room, Appointment, Admission, Prescription } = require("../models");

const seedUsers = async () => {
  const password = await bcrypt.hash("Password123!", 10);

  const users = [
    {
      first_name: "Alice",
      last_name: "Admin",
      email: "admin@hospital.com",
      phone: "555-0001",
      role: "Admin",
      password_hash: password
    },
    {
      first_name: "Derek",
      last_name: "Doctor",
      email: "doctor1@hospital.com",
      phone: "555-1001",
      role: "Doctor",
      password_hash: password
    },
    {
      first_name: "Nina",
      last_name: "Nurse",
      email: "nurse@hospital.com",
      phone: "555-2001",
      role: "Nurse",
      password_hash: password
    },
    {
      first_name: "Patrick",
      last_name: "Patient",
      email: "patient@hospital.com",
      phone: "555-3001",
      role: "Patient",
      password_hash: password
    }
  ];

  await User.bulkCreate(users, { ignoreDuplicates: true });
};

const seedRooms = async () => {
  const rooms = [
    { room_number: "ICU-1", type: "ICU", capacity: 1, is_available: true },
    { room_number: "GEN-101", type: "General", capacity: 4, is_available: true },
    { room_number: "PRI-201", type: "Private", capacity: 1, is_available: true }
  ];

  await Room.bulkCreate(rooms, { ignoreDuplicates: true });
};

const seedAppointments = async () => {
  const doctor = await User.findOne({ where: { role: "Doctor" } });
  const patient = await User.findOne({ where: { role: "Patient" } });

  if (!doctor || !patient) return;

  await Appointment.findOrCreate({
    where: {
      doctor_id: doctor.user_id,
      patient_id: patient.user_id,
      scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    defaults: {
      status: "Scheduled",
      reason: "Routine check-up",
      notes: "Initial appointment created via seed"
    }
  });
};

const seedAdmissions = async () => {
  const patient = await User.findOne({ where: { role: "Patient" } });
  const room = await Room.findOne({ where: { room_number: "GEN-101" } });

  if (!patient || !room) return;

  await Admission.findOrCreate({
    where: {
      patient_id: patient.user_id,
      room_id: room.room_id,
      status: "Admitted"
    },
    defaults: {
      diagnosis: "Observation after surgery",
      admitted_at: new Date()
    }
  });
};

const seedPrescriptions = async () => {
  const doctor = await User.findOne({ where: { role: "Doctor" } });
  const patient = await User.findOne({ where: { role: "Patient" } });
  const appointment = await Appointment.findOne();

  if (!doctor || !patient) return;

  await Prescription.findOrCreate({
    where: {
      doctor_id: doctor.user_id,
      patient_id: patient.user_id,
      medication: "Paracetamol"
    },
    defaults: {
      appointment_id: appointment ? appointment.appointment_id : null,
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "7 days",
      instructions: "Take with food. Do not exceed recommended dosage.",
      status: "Active"
    }
  });
};

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    await seedUsers();
    await seedRooms();
    await seedAppointments();
    await seedAdmissions();
    await seedPrescriptions();

    console.log("✅ Seed data inserted");
  } catch (error) {
    console.error("❌ Failed to seed database:", error);
  } finally {
    await sequelize.close();
  }
};

run();

