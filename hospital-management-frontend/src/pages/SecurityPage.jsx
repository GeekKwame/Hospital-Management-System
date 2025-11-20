import { useEffect, useState } from "react";
import { apiClient } from "../api/client.js";
import DataTable from "../components/ui/DataTable.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const SecurityPage = () => {
  const { token, user, isAdmin: userIsAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [email, setEmail] = useState(user?.email || "");
  const [resetResponse, setResetResponse] = useState("");
  const [error, setError] = useState("");

  const isAdmin = userIsAdmin || user?.role === "Admin";

  useEffect(() => {
    const loadLogs = async () => {
      if (!isAdmin || !token) return;
      try {
        const data = await apiClient("/admin/audit-logs", { token });
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (isAdmin && token) {
      loadLogs();
    }
  }, [isAdmin, token]);

  const handleReset = async (event) => {
    event.preventDefault();
    setError("");
    setResetResponse("");
    try {
      const response = await apiClient("/auth/request-reset", {
        method: "POST",
        body: { email }
      });
      setResetResponse(response.message + (response.token ? ` Token: ${response.token}` : ""));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="stack">
      <div className="card">
        <h2>Password recovery</h2>
        <form className="horizontal-form" onSubmit={handleReset}>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <button type="submit">Send reset link</button>
        </form>
        {resetResponse && <p>{resetResponse}</p>}
        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      </div>

      {isAdmin ? (
        <div className="card">
          <h2>Recent audit logs</h2>
          <DataTable
            columns={[
              { key: "created_at", label: "When", render: (row) => new Date(row.created_at).toLocaleString() },
              {
                key: "actor",
                label: "Actor",
                render: (row) =>
                  row.actor ? `${row.actor.first_name} ${row.actor.last_name} (${row.actor.role})` : "System"
              },
              { key: "action", label: "Action" },
              { key: "resource", label: "Resource" }
            ]}
            rows={logs}
          />
        </div>
      ) : (
        <div className="card">
          <h2>Security tips</h2>
          <ul>
            <li>Use strong passwords and rotate them regularly.</li>
            <li>Review your activity log from an administrator upon request.</li>
            <li>Log out from shared devices.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SecurityPage;

