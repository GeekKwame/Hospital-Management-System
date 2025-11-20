const request = require("supertest");
const bcrypt = require("bcryptjs");

const { app } = require("../server");
const User = require("../models/User");

describe("Auth API", () => {
  test("registers a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        first_name: "Test",
        last_name: "User",
        email: "testuser@example.com",
        phone: "1234567890",
        role: "Patient",
        password: "Password123!"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).not.toHaveProperty("password_hash");
  });

  test("logs in an existing user", async () => {
    const password_hash = await bcrypt.hash("Password123!", 10);
    await User.create({
      first_name: "Login",
      last_name: "User",
      email: "login@example.com",
      phone: "0987654321",
      role: "Doctor",
      password_hash
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "Password123!" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  });
});

