import { useEffect, useMemo, useState } from "react";
import { apiClient } from "../api/client.js";
import AppointmentForm from "../components/AppointmentForm.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const AppointmentsPage = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const filteredAppointments = useMemo(() => {
    if (filter === "all") return appointments;
    return appointments.filter((item) => item.status === filter);
  }, [appointments, filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appointmentRes, doctorRes, patientRes] = await Promise.all([
        apiClient("/appointments", { token }),
        apiClient("/users/doctors", { token }),
        apiClient("/users/patients", { token })
      ]);
      setAppointments(appointmentRes);
      setDoctors(doctorRes);
      setPatients(patientRes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  return (
    <div className="stack">
      <div className="card">
        <div className="card-header">
          <h2>Appointments</h2>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={[
              { key: "appointment_id", label: "ID" },
              { key: "doctor_id", label: "Doctor" },
              { key: "patient_id", label: "Patient" },
              {
                key: "scheduled_at",
                label: "Schedule",
                render: (row) => new Date(row.scheduled_at).toLocaleString()
              },
              { key: "status", label: "Status", render: (row) => <StatusPill label={row.status} /> }
            ]}
            rows={filteredAppointments}
            emptyLabel="No appointments"
          />
        )}
      </div>

      <AppointmentForm token={token} doctors={doctors} patients={patients} onSuccess={loadData} />
    </div>
  );
};

export default AppointmentsPage;

