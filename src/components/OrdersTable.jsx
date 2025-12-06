export default function OrdersTable({ rows = [] }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="section-title">Orders by date</p>
        <span className="badge">GET /api/metrics/orders-by-date</span>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-400">No orders yet. Seed data to see movement.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date}>
                  <td className="font-semibold text-slate-100">{row.date}</td>
                  <td>{row.orders}</td>
                  <td className="text-amber-200">₹{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
