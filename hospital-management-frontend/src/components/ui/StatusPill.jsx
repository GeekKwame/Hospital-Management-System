const palette = {
  Scheduled: "var(--primary)",
  "In Progress": "var(--warning)",
  Completed: "var(--success)",
  Cancelled: "var(--danger)",
  Admitted: "var(--primary)",
  "Under Observation": "var(--warning)",
  Discharged: "var(--success)"
};

const StatusPill = ({ label }) => (
  <span
    className="status-pill"
    style={{
      background: `${palette[label] || "var(--muted)"}22`,
      color: palette[label] || "var(--muted)"
    }}
  >
    {label}
  </span>
);

export default StatusPill;

