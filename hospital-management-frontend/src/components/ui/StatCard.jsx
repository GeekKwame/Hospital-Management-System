const StatCard = ({ label, value, trend, accent = "var(--primary)" }) => (
  <div className="stat-card">
    <p>{label}</p>
    <h3>{value}</h3>
    {trend && <small style={{ color: accent }}>{trend}</small>}
  </div>
);

export default StatCard;

