# Hospital Management System Backend - Project Documentation

## 1. Project Overview

The **Hospital Management System Backend** is a Node.js-based REST API that provides secure authentication, user role management, and CRUD functionalities for doctors, patients, and appointments. This system is designed to streamline hospital operations and manage patient data efficiently.

## 2. Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (via Sequelize ORM)
- **Authentication:** JSON Web Tokens (JWT)
- **Middleware:** Role-based access control (RBAC)
- **Deployment:** Heroku/DigitalOcean/AWS (Optional)

## 3. Setup & Installation Guide

### Prerequisites

- Install **Node.js** (v14 or later)
- Install **PostgreSQL** (for database management)

### Steps to Run the Backend

1. Clone the repository:
   ```sh
   git clone <repository_link>
   cd hospital-management-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file for environment variables:
   ```env
   PORT=5000
   DB_URL=postgres://user:password@localhost:5432/hospital_db
   JWT_SECRET=your_secret_key
   ```
4. Run database migrations:
   ```sh
   npx sequelize-cli db:migrate
   ```
5. Start the server:
   ```sh
   node server.js
   ```
   The API will be running on [**http://localhost:5000**](http://localhost:5000).

## 4. Authentication & Security

### User Registration & Login

- **Endpoint:** `/api/auth/register`, `/api/auth/login`
- Users register with `first_name`, `last_name`, `email`, `phone`, `password`, and `role` (Admin, Doctor, Patient).
- JWT is issued upon successful login.

### JWT Authentication Middleware

- The middleware `authMiddleware.js` verifies JWT tokens for protected routes.
- Example usage:
  ```js
  const authMiddleware = require("../middlewares/authMiddleware");
  router.get("/admin/dashboard", authMiddleware, (req, res) => {
      res.json({ message: "Welcome to Admin Dashboard" });
  });
  ```

### Role-Based Access Control (RBAC)

- The `roleMiddleware.js` ensures only authorized roles can access specific routes.
- Example usage:
  ```js
  const roleMiddleware = require("../middlewares/roleMiddleware");
  router.get("/admin/dashboard", authMiddleware, roleMiddleware(["Admin"]), (req, res) => {
      res.json({ message: "Admin Dashboard" });
  });
  ```

## 5. API Endpoints & Usage

### Doctors & Patients

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/api/doctors`      | Fetch all doctors      |
| GET    | `/api/doctors/:id`  | Fetch specific doctor  |
| POST   | `/api/doctors`      | Create a new doctor    |
| PUT    | `/api/doctors/:id`  | Update doctor details  |
| DELETE | `/api/doctors/:id`  | Remove a doctor        |
| GET    | `/api/patients`     | Fetch all patients     |
| GET    | `/api/patients/:id` | Fetch specific patient |
| POST   | `/api/patients`     | Create a new patient   |
| PUT    | `/api/patients/:id` | Update patient details |
| DELETE | `/api/patients/:id` | Remove a patient       |

### Appointments

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| POST   | `/api/appointments`            | Book an appointment       |
| GET    | `/api/appointments/:doctor_id` | Fetch doctor’s schedule   |
| PUT    | `/api/appointments/:id`        | Update appointment status |
| DELETE | `/api/appointments/:id`        | Cancel an appointment     |

### Room & Admission Management

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/api/rooms`          | List available rooms  |
| PATCH  | `/api/rooms/:id`      | Update room occupancy |
| POST   | `/api/admissions`     | Admit a patient       |
| PATCH  | `/api/admissions/:id` | Discharge patient     |

## 6. Connecting Backend to Frontend (AngularJS)

1. **Set up an AngularJS project**
2. **Create authentication services** for login & registration
3. **Develop user dashboards** for different roles (Admin, Doctor, Patient)
4. **Integrate API calls** using `HttpClientModule`
   ```js
   this.http.post('http://localhost:5000/api/auth/login', userData)
   ```

## 7. Testing & Deployment

### Postman API Testing

- Use Postman to test API endpoints.
- Example **POST request** to register a user:
  ```json
  {
      "first_name": "John",
      "last_name": "Doe",
      "email": "johndoe@example.com",
      "phone": "123456789",
      "role": "Doctor",
      "password": "securepassword"
  }
  ```

### Deployment

- Deploy the backend to **Heroku/DigitalOcean/AWS**.
- Deploy the frontend to **Vercel/Netlify**.

## 8. Conclusion

This backend provides a scalable and secure system for managing hospitals. It enables authentication, patient-doctor interactions, and hospital operations. Future improvements may include **report generation**, **payment integration**, and **real-time notifications**.

