const ResourcePanel = ({ title, items, columns, loading }) => (
  <div className="card">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>{title}</h2>
      {loading && <small>Refreshing…</small>}
    </div>
    {items.length === 0 ? (
      <p>No records found.</p>
    ) : (
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${title}-${item.user_id || item.room_id}`}>
              {columns.map((column) => (
                <td key={column.key}>{item[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default ResourcePanel;

