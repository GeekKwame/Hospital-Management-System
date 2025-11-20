# Hospital Management System – Full Stack Guide

A complete, production-ready Hospital Management System built with Node.js/Express backend and React frontend. Features user authentication, role-based access control, appointment management, patient records, room management, and analytics.

---

## 📋 Table of Contents

1. [Project Structure](#1-project-structure)
2. [Prerequisites](#2-prerequisites)
3. [Backend Setup](#3-backend-setup)
4. [Frontend Setup](#4-frontend-setup)
5. [Running the Application](#5-running-the-application)
6. [Features](#6-features)
7. [API Documentation](#7-api-documentation)
8. [Testing](#8-testing)
9. [Deployment](#9-deployment)

---

## 1. Project Structure

```
Hospital-Management-System/
├── hospital-management-backend/     # Express + Sequelize API
│   ├── controllers/                  # Request handlers
│   ├── models/                       # Sequelize models
│   ├── routes/                       # API routes
│   ├── middlewares/                  # Auth & role middleware
│   ├── utils/                        # Utilities (audit logging)
│   └── scripts/                      # Seed scripts
│
└── hospital-management-frontend/     # Vite + React dashboard
    ├── src/
    │   ├── pages/                    # Page components
    │   │   ├── auth/                 # Login & Register
    │   │   ├── patients/             # Patient management
    │   │   ├── doctors/             # Doctor listings
    │   │   ├── appointments/         # Appointment management
    │   │   ├── prescriptions/       # Prescription management
    │   │   ├── profile/              # User profile
    │   │   └── settings/             # User settings
    │   ├── components/               # Reusable components
    │   ├── contexts/                 # React contexts (Auth)
    │   ├── layouts/                  # Layout components
    │   └── api/                      # API client
    └── public/
```

---

## 2. Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 13+ (or use Docker Compose)
- **Git** (for cloning the repository)

---

## 3. Backend Setup

### Step 1: Install Dependencies

```bash
cd hospital-management-backend
npm install
```

### Step 2: Configure Environment

Create `hospital-management-backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=hospital_db
JWT_SECRET=super_secret_key_change_in_production
NODE_ENV=development
```

> **Alternative:** Use `DB_URL=postgres://user:pass@host:5432/dbname` instead of individual DB variables.

### Step 3: Set Up Database

1. Create PostgreSQL database:
   ```sql
   CREATE DATABASE hospital_db;
   ```

2. The application will automatically create tables on first run.

### Step 4: Seed Sample Data (Optional)

```bash
npm run seed
```

This creates:
- **Admin account**: `admin@hospital.com` / `Password123!`
- **Doctor accounts**: `doctor1@hospital.com`, `doctor2@hospital.com` / `Password123!`
- **Nurse account**: `nurse@hospital.com` / `Password123!`
- **Patient accounts**: `patient@hospital.com` / `Password123!`
- Sample rooms, admissions, and appointments

### Step 5: Start Backend Server

```bash
npm start
```

Backend will run at `http://localhost:5000`

---

## 4. Frontend Setup

### Step 1: Install Dependencies

```bash
cd hospital-management-frontend
npm install
```

### Step 2: Configure Environment (Optional)

Create `hospital-management-frontend/.env` if your backend is not at `http://localhost:5000/api`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Development Server

```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

---

## 5. Running the Application

### Option A: Run Separately (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd hospital-management-backend
npm install
# Create .env file
npm run seed  # Optional
npm start
```

**Terminal 2 - Frontend:**
```bash
cd hospital-management-frontend
npm install
npm run dev
```

### Option B: Docker Compose (All-in-One)

From the root directory:

```bash
docker-compose up
```

This starts:
- PostgreSQL database (port 5432)
- Backend API (port 5000)
- Frontend (port 5173)

---

## 6. Features

### Authentication & Authorization
- ✅ User registration with role selection (Admin, Doctor, Nurse, Patient)
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Protected routes
- ✅ Password reset functionality

### Dashboard
- ✅ Overview statistics (doctors, patients, appointments, admissions)
- ✅ Appointment trends chart
- ✅ Upcoming appointments list
- ✅ Real-time data updates

### Patient Management
- ✅ Patient listing with search
- ✅ Patient detail view
- ✅ Patient appointment history
- ✅ Admin can add new patients

### Doctor Management
- ✅ Doctor directory
- ✅ Doctor availability
- ✅ Doctor profile cards

### Appointment Management
- ✅ Create, view, update appointments
- ✅ Filter by status (Scheduled, In Progress, Completed, Cancelled)
- ✅ Appointment scheduling with doctor and patient selection
- ✅ Status management

### Room & Admission Management
- ✅ Room utilization dashboard
- ✅ Room availability tracking
- ✅ Admission management
- ✅ Admission status updates

### Analytics
- ✅ Key metrics dashboard
- ✅ Appointment trends visualization
- ✅ Room utilization statistics

### User Features
- ✅ User profile page
- ✅ Settings page
- ✅ Security center (password reset, audit logs for admins)

### UI/UX
- ✅ Material-UI design system
- ✅ Responsive design (mobile-friendly)
- ✅ Modern, clean interface
- ✅ Loading states and error handling

---

## 7. API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "Patient",
    "password": "Password123!"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "admin@hospital.com",
    "password": "Password123!"
  }
  ```

- `POST /api/auth/request-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Endpoints

- `GET /api/users/doctors` - Get all doctors (Admin, Doctor, Nurse)
- `GET /api/users/patients` - Get all patients (Admin, Doctor, Nurse)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Appointment Endpoints

- `GET /api/appointments` - Get all appointments (with optional filters)
- `GET /api/appointments?patientId=1` - Get patient appointments
- `GET /api/appointments?doctorId=1` - Get doctor appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Room & Admission Endpoints

- `GET /api/rooms` - Get all rooms
- `PATCH /api/rooms/:id` - Update room availability
- `GET /api/admissions` - Get all admissions
- `POST /api/admissions` - Create admission
- `PATCH /api/admissions/:id/status` - Update admission status

### Analytics Endpoints

- `GET /api/analytics/summary` - Get dashboard summary
- `GET /api/analytics/appointments/trends` - Get appointment trends
- `GET /api/analytics/rooms` - Get room utilization data

### Admin Endpoints

- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/audit-logs` - Get audit logs (Admin only)

**All endpoints (except auth) require JWT token in Authorization header:**
```
Authorization: Bearer <token>
```

---

## 8. Testing

### Backend Tests

The backend includes Jest + Supertest test suites:

```bash
cd hospital-management-backend
npm test
```

Tests use an isolated SQLite in-memory database.

### Manual Testing

1. **Login Test:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@hospital.com","password":"Password123!"}'
   ```

2. **Get Doctors (with token):**
   ```bash
   curl http://localhost:5000/api/users/doctors \
     -H "Authorization: Bearer <your_token>"
   ```

---

## 9. Deployment

### Backend Deployment

1. Create `hospital-management-backend/.env.production` with production values
2. Build Docker image:
   ```bash
   docker build -t hms-backend ./hospital-management-backend
   docker run --env-file .env.production -p 5000:5000 hms-backend
   ```
3. Use managed PostgreSQL (AWS RDS, Supabase, etc.)

### Frontend Deployment

1. Build for production:
   ```bash
   cd hospital-management-frontend
   npm run build
   ```

2. Deploy `dist/` folder to:
   - **Netlify**: Drag & drop `dist/` folder
   - **Vercel**: `vercel --prod`
   - **Any static host**: Upload `dist/` contents

3. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```

### Docker Compose Deployment

```bash
docker-compose up -d
```

---

## 🔐 Default Login Credentials (After Seeding)

After running `npm run seed`, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@hospital.com` | `Password123!` |
| Doctor | `doctor1@hospital.com` | `Password123!` |
| Nurse | `nurse@hospital.com` | `Password123!` |
| Patient | `patient@hospital.com` | `Password123!` |

---

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **Sequelize** - ORM for database operations
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Jest** - Testing framework

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Material-UI (MUI)** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization

---

## 📝 Notes

- The application uses JWT tokens stored in localStorage
- All API requests include the token in the Authorization header
- Role-based access control is enforced on both frontend and backend
- Audit logging tracks all important actions (Admin view only)
- The seed script creates sample data for testing

---

## 🚀 Future Enhancements

- [ ] Real-time notifications (Socket.IO)
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] Payment integration
- [ ] Medical records management
- [ ] Prescription management (full implementation)
- [ ] CI/CD pipeline
- [ ] Multi-language support
- [ ] Dark mode theme

---

## 📄 License

This project is available for educational and development purposes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Happy Coding! 🎉** 

