import { useState } from "react";
import { apiClient } from "../api/client.js";

const initialState = {
  doctor_id: "",
  patient_id: "",
  scheduled_at: "",
  reason: ""
};

const AppointmentForm = ({ token, doctors, patients, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await apiClient("/appointments", {
        method: "POST",
        token,
        body: {
          ...form,
          doctor_id: Number(form.doctor_id),
          patient_id: Number(form.patient_id)
        }
      });
      setForm(initialState);
      setMessage("Appointment booked!");
      onSuccess?.();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Book appointment</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="doctor_id">Doctor</label>
        <select
          id="doctor_id"
          name="doctor_id"
          value={form.doctor_id}
          onChange={handleChange}
          required
        >
          <option value="">Select doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.user_id} value={doctor.user_id}>
              {doctor.first_name} {doctor.last_name}
            </option>
          ))}
        </select>

        <label htmlFor="patient_id">Patient</label>
        <select
          id="patient_id"
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
          required
        >
          <option value="">Select patient</option>
          {patients.map((patient) => (
            <option key={patient.user_id} value={patient.user_id}>
              {patient.first_name} {patient.last_name}
            </option>
          ))}
        </select>

        <label htmlFor="scheduled_at">Date & time</label>
        <input
          type="datetime-local"
          id="scheduled_at"
          name="scheduled_at"
          value={form.scheduled_at}
          onChange={handleChange}
          required
        />

        <label htmlFor="reason">Reason</label>
        <textarea
          id="reason"
          name="reason"
          rows="3"
          value={form.reason}
          onChange={handleChange}
        />

        {message && <p>{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Booking…" : "Book appointment"}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;

