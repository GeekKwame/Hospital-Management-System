const DataTable = ({ columns, rows, emptyLabel = "No records" }) => {
  if (!rows.length) {
    return <p>{emptyLabel}</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id ?? row.appointment_id ?? row.room_id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {typeof column.render === "function" ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

