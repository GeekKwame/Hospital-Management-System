import { useEffect, useState } from "react";
import { apiClient } from "../api/client.js";
import DataTable from "../components/ui/DataTable.jsx";
import TrendChart from "../components/charts/TrendChart.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const AnalyticsPage = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [summaryResponse, trendsResponse] = await Promise.all([
          apiClient("/analytics/summary", { token }),
          apiClient("/analytics/appointments/trends", { token })
        ]);
        setSummary(summaryResponse);
        setTrendData(trendsResponse);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadAnalytics();
    }
  }, [token]);

  if (loading && !summary) {
    return <p>Loading analytics...</p>;
  }

  return (
    <div className="stack">
      <TrendChart data={trendData} />

      <div className="card">
        <h2>Key metrics</h2>
        <DataTable
          columns={[
            { key: "metric", label: "Metric" },
            { key: "value", label: "Value" }
          ]}
          rows={[
            { id: "doctors", metric: "Doctors", value: summary?.doctors ?? 0 },
            { id: "patients", metric: "Patients", value: summary?.patients ?? 0 },
            { id: "nurses", metric: "Nurses", value: summary?.nurses ?? 0 },
            { id: "appointments", metric: "Total appointments", value: summary?.totalAppointments ?? 0 },
            { id: "today", metric: "Appointments today", value: summary?.todaysAppointments ?? 0 },
            { id: "admissions", metric: "Active admissions", value: summary?.activeAdmissions ?? 0 }
          ]}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;

