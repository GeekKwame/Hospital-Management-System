import { useEffect, useState } from "react";
import { apiClient } from "../api/client.js";
import StatusPill from "../components/ui/StatusPill.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const RoomsPage = () => {
  const { token } = useAuth();
  const [roomsReport, setRoomsReport] = useState({ rooms: [], totalsByType: {} });
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const [roomsRes, admissionsRes] = await Promise.all([
        apiClient("/analytics/rooms", { token }),
        apiClient("/admissions", { token })
      ]);
      setRoomsReport(roomsRes);
      setAdmissions(admissionsRes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadRooms();
    }
  }, [token]);

  const updateAdmissionStatus = async (admissionId, status) => {
    await apiClient(`/admissions/${admissionId}/status`, {
      method: "PATCH",
      token,
      body: { status }
    });
    loadRooms();
  };

  return (
    <div className="stack">
      <div className="card">
        <div className="card-header">
          <h2>Room utilization</h2>
          {loading && <small>Refreshing...</small>}
        </div>
        <div className="grid grid-3">
          {Object.entries(roomsReport.totalsByType || {}).map(([type, data]) => {
            const utilization = data.total === 0 ? 0 : Math.round((data.occupied / data.total) * 100);
            return (
              <div className="stat-card" key={type}>
                <p>{type}</p>
                <h3>
                  {data.occupied}/{data.total}
                </h3>
                <small>{utilization}% occupied</small>
              </div>
            );
          })}
        </div>

        <DataTable
          columns={[
            { key: "room_number", label: "Room" },
            { key: "type", label: "Type" },
            { key: "capacity", label: "Capacity" },
            {
              key: "is_available",
              label: "Available",
              render: (row) => (row.is_available ? "Yes" : "No")
            },
            {
              key: "active_admissions",
              label: "Active patients",
              render: (row) => row.active_admissions
            }
          ]}
          rows={roomsReport.rooms || []}
          emptyLabel="No rooms configured"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Admissions</h2>
        </div>
        <DataTable
          columns={[
            { key: "admission_id", label: "ID" },
            { key: "patient", label: "Patient", render: (row) => `${row.patient.first_name} ${row.patient.last_name}` },
            { key: "room", label: "Room", render: (row) => row.room.room_number },
            {
              key: "status",
              label: "Status",
              render: (row) => <StatusPill label={row.status} />
            },
            {
              key: "admitted_at",
              label: "Admitted",
              render: (row) => new Date(row.admitted_at).toLocaleString()
            },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <select
                  value={row.status}
                  onChange={(event) => updateAdmissionStatus(row.admission_id, event.target.value)}
                >
                  <option value="Admitted">Admitted</option>
                  <option value="Under Observation">Under Observation</option>
                  <option value="Discharged">Discharged</option>
                </select>
              )
            }
          ]}
          rows={admissions}
          emptyLabel="No admissions"
        />
      </div>
    </div>
  );
};

export default RoomsPage;

