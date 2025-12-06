export default function TopCustomers({ customers = [] }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="section-title">Top customers</p>
        <span className="badge">GET /api/metrics/top-customers</span>
      </div>

      {customers.length === 0 ? (
        <p className="text-sm text-slate-400">No customers yet. Seed or sync to populate.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Lifetime spend</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerId}>
                  <td className="font-semibold text-slate-100">{customer.name}</td>
                  <td className="text-slate-400">{customer.email || '—'}</td>
                  <td>{customer.orderCount}</td>
                  <td className="text-amber-200">₹{customer.totalSpent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
