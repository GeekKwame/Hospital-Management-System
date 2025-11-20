const request = require("supertest");
const jwt = require("jsonwebtoken");

const { app } = require("../server");
const config = require("../config");
const { User, Appointment } = require("../models");

const buildToken = (user) =>
  jwt.sign({ user_id: user.user_id, role: user.role }, config.JWT_SECRET);

describe("Appointment API", () => {
  test("doctor can create and fetch appointments", async () => {
    const doctor = await User.create({
      first_name: "Doc",
      last_name: "Tor",
      email: "doc@example.com",
      phone: "1111111111",
      role: "Doctor",
      password_hash: "placeholder"
    });

    const patient = await User.create({
      first_name: "Pat",
      last_name: "Ient",
      email: "patient@example.com",
      phone: "2222222222",
      role: "Patient",
      password_hash: "placeholder"
    });

    const token = buildToken(doctor);
    const scheduled_at = new Date().toISOString();

    const createRes = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        doctor_id: doctor.user_id,
        patient_id: patient.user_id,
        scheduled_at,
        reason: "Follow-up"
      });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body).toHaveProperty("appointment_id");

    const listRes = await request(app)
      .get(`/api/appointments/${doctor.user_id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body[0]).toHaveProperty("doctor_id", doctor.user_id);
  });

  test("admin can delete appointments", async () => {
    const admin = await User.create({
      first_name: "Ad",
      last_name: "Min",
      email: "admin2@example.com",
      phone: "3333333333",
      role: "Admin",
      password_hash: "placeholder"
    });

    const doctor = await User.create({
      first_name: "Doc2",
      last_name: "Tor",
      email: "doc2@example.com",
      phone: "4444444444",
      role: "Doctor",
      password_hash: "placeholder"
    });

    const patient = await User.create({
      first_name: "Pat2",
      last_name: "Ient",
      email: "patient2@example.com",
      phone: "5555555555",
      role: "Patient",
      password_hash: "placeholder"
    });

    const appointment = await Appointment.create({
      doctor_id: doctor.user_id,
      patient_id: patient.user_id,
      scheduled_at: new Date(),
      status: "Scheduled"
    });

    const adminToken = buildToken(admin);

    const deleteRes = await request(app)
      .delete(`/api/appointments/${appointment.appointment_id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteRes.statusCode).toBe(204);
  });
});

