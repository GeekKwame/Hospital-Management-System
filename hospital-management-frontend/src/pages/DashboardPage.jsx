import { useEffect, useState } from "react";
import { apiClient } from "../api/client.js";
import StatCard from "../components/ui/StatCard.jsx";
import TrendChart from "../components/charts/TrendChart.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const DashboardPage = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [summaryRes, trendRes, appointmentsRes] = await Promise.all([
          apiClient("/analytics/summary", { token }),
          apiClient("/analytics/appointments/trends", { token }),
          apiClient("/appointments", { token })
        ]);
        setSummary(summaryRes);
        setTrendData(trendRes);
        setUpcoming(appointmentsRes.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadDashboard();
    }
  }, [token]);

  if (loading && !summary) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">
      <div className="grid grid-4">
        <StatCard label="Doctors" value={summary?.doctors ?? 0} />
        <StatCard label="Patients" value={summary?.patients ?? 0} />
        <StatCard label="Active Admissions" value={summary?.activeAdmissions ?? 0} />
        <StatCard label="Today&apos;s Appointments" value={summary?.todaysAppointments ?? 0} />
      </div>

      <TrendChart data={trendData} />

      <div className="card">
        <h2>Upcoming appointments</h2>
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
          rows={upcoming}
          emptyLabel="No upcoming appointments"
        />
      </div>
    </div>
  );
};

export default DashboardPage;

